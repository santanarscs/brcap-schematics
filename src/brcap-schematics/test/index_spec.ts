import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import * as angularJsonStub from './stubs/angular.json';
import * as appModuleStub from './stubs/app.module.json';
import * as packageJsonStub from './stubs/package.json';
import * as packageJsonBrCapViewStub from './stubs/package-brcap-view.json';
import { installBrCapViewComponent } from '..';

const collectionPath = path.join(__dirname, '../../collection.json');

let testTree: Tree;

beforeEach(() => {
	testTree = Tree.empty();
	testTree.create('./angular.json', JSON.stringify(angularJsonStub));
	testTree.create('./src/app/app.module.ts', JSON.stringify(appModuleStub.content));
	testTree.create('./package.json', JSON.stringify(packageJsonStub));
});

describe('brcap-schematics', () => {
	describe('when creating files', () => {
		it('create the right number of files', async () => {
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner.runSchematicAsync('brcap-schematics', { name: 'test' }, testTree).toPromise();

			expect(tree.files.length).toEqual(16);
		});
		it('gives files the correct names', async () => {
			const nameOption = 'test';
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner.runSchematicAsync('brcap-schematics', { name: nameOption }, testTree).toPromise();
			expect(tree.files.slice(3).includes(`/${nameOption}/${nameOption}-routing.module.ts`)).toBeTruthy();
		});

		it('can create files under a deeper path', async () => {
			const nameOption = 'test';
			const pathOption = 'fake-path';
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner
				.runSchematicAsync('brcap-schematics', { name: nameOption, path: pathOption }, testTree)
				.toPromise();

			tree.files.slice(3).forEach((filePath: string) => {
				expect(filePath.startsWith(`/${pathOption}/`)).toEqual(true);
			});
		});

		it('does not create test files when spec is false', async () => {
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner
				.runSchematicAsync('brcap-schematics', { name: 'test', spec: 'false' }, testTree)
				.toPromise();

			expect(tree.files.length).toEqual(13);
		});
	});

	describe('when inserting content', () => {
		it('updates template files correctly', async () => {
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner.runSchematicAsync('brcap-schematics', { name: 'test' }, testTree).toPromise();
			const servicePath = tree.files.pop() || '';
			const service = tree.read(servicePath) as Buffer;

			expect(service.toString('utf-8')).toContain('export class TestService');
		});

		it('adds a new import to the root module', async () => {
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner.runSchematicAsync('brcap-schematics', { name: 'test' }, testTree).toPromise();
			const module = tree.read('./src/app/app.module.ts') as Buffer;

			expect(module.toString('utf-8')).toContain(`import { TestModule } from './/test/test.module';`);
		});

		it('adds a new module to the imports array in the root module', async () => {
			const runner = new SchematicTestRunner('schematics', collectionPath);
			const tree = await runner.runSchematicAsync('brcap-schematics', { name: 'test' }, testTree).toPromise();
			const module = tree.read('./src/app/app.module.ts') as Buffer;

			expect(module.toString('utf-8')).toContain(', TestModule');
		});
	});

	describe('when installing dependencies', () => {
		let contextStub: SchematicContext;

		beforeEach(() => {
			contextStub = {
				debug: false,
				engine: jasmine.createSpyObj('engine', [
					'createCollection',
					'createContext',
					'createSchematic',
					'createSourceFromUrl',
					'transformOptions',
					'executePostTasks'
				]),
				logger: jasmine.createSpyObj('logger', [ 'info' ]),
				schematic: jasmine.createSpyObj('schematic', [ 'call' ]),
				strategy: 0,
				interactive: false,
				addTask: jasmine.createSpy('addTask')
			};
		});

		it('schedules an npm install task if BrCapView is not installed', () => {
			const rule = installBrCapViewComponent();
			rule(testTree, contextStub);

			expect(contextStub.addTask).toHaveBeenCalled();
			expect(contextStub.logger.info).toHaveBeenCalledWith('🔍 Installing BrCapViewComponent');
		});

		it('does not schedule a task if BrCapView is installed', () => {
			testTree.overwrite('./package.json', JSON.stringify(packageJsonBrCapViewStub));
			const rule = installBrCapViewComponent();
			rule(testTree, contextStub);

			expect(contextStub.addTask).not.toHaveBeenCalled();
			expect(contextStub.logger.info).toHaveBeenCalledWith('✅️ BrCapViewComponent already installed');
		});
	});
});
