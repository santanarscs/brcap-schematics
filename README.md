# Instalação

```
npm install brcap-schematics
```

## Comandos disponiveis

```
ng g brcap-schematics:feature-module
```

## Exemplo

```
ng g brcap-schematics:feature-module --name=<nome-do-modulo> --path=src/app/features
```

## Pós-gerar código

- Adicione o feature módulo recém criado no app modulo ou modulo pai

```
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ModuloCriadoModule } from "caminho-do-modulo/ModuloCriadoModule";

NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,  ModuloCriadoModule],
  bootstrap: [AppComponent],
});
export class AppModule {}

```
