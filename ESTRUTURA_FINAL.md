# 🗂️ Estrutura Final do Projeto Soul Saluttē

## ❌ Arquivos para DELETAR da raiz:
- `/App.tsx` ← **ESTE É O PROBLEMA PRINCIPAL**
- `/components/` (pasta inteira)
- `/contexts/` (pasta inteira) 
- `/data/` (pasta inteira)
- `/styles/` (pasta inteira)
- `/types/` (pasta inteira)
- `/copy-ui-components.js`
- `/cleanup-project.md`
- `/cleanup.sh`

## ✅ Estrutura Correta (manter apenas):
```
/src/
  App.tsx ← Principal
  main.tsx
  /components/
    Layout.tsx
    LoginForm.tsx
    Dashboard.tsx
    ClientesPage.tsx
    ClienteForm.tsx
    /ui/
      todos os componentes UI
  /contexts/
    AuthContext.tsx
  /data/
    mockData.ts
  /types/
    index.ts
  /lib/
    utils.ts
  /styles/
    globals.css
```

## 🎯 Problema Atual:
O arquivo `/App.tsx` na raiz está interceptando os imports `@/` e causando erro 404 nos módulos. O Vite só resolve paths `@/` quando o arquivo está em `/src/`.

## 🔧 Solução:
1. DELETE o arquivo `/App.tsx` da raiz
2. DELETE todas as pastas duplicadas da raiz 
3. Use apenas `/src/App.tsx` que já está correto

## 📋 Comandos para executar:
```bash
rm App.tsx
rm -rf components contexts data styles types
rm copy-ui-components.js cleanup-project.md cleanup.sh
```