# Como Usar o ViewMode (Modo de Visualização)

## 📋 Importar o Hook

```typescript
import { useViewMode } from "@/context/ViewModeContext";
```

## 🎯 Usar em Qualquer Tela

```typescript
export default function MinhaScreen() {
  const { viewMode, hasCompany, companyId } = useViewMode();

  return (
    <View>
      {viewMode === "client" ? (
        <Text>Você está vendo como CLIENTE</Text>
      ) : (
        <Text>Você está vendo como EMPRESA</Text>
      )}
    </View>
  );
}
```

## 🔧 Propriedades Disponíveis

```typescript
const {
  viewMode,        // "client" | "company"
  toggleViewMode,  // Função para alternar entre modos
  setViewMode,     // Função para definir modo específico
  hasCompany,      // boolean - Se usuário tem empresa
  companyId,       // string | null - ID da empresa
} = useViewMode();
```

## 💡 Exemplos de Uso

### 1. Condicionar Renderização

```typescript
const { viewMode } = useViewMode();

return (
  <>
    {viewMode === "client" ? (
      <ClientDashboard />
    ) : (
      <CompanyDashboard />
    )}
  </>
);
```

### 2. Alterar Cores/Estilo

```typescript
const { viewMode } = useViewMode();

const backgroundColor = viewMode === "client"
  ? themeColors.primary
  : themeColors.orange;
```

### 3. Filtrar Dados

```typescript
const { viewMode, companyId } = useViewMode();

const data = viewMode === "company"
  ? await getCompanyData(companyId)
  : await getClientData();
```

### 4. Verificar Se Tem Empresa

```typescript
const { hasCompany } = useViewMode();

if (hasCompany) {
  // Mostrar opção de trocar para empresa
}
```

### 5. Buscar Dados da API Baseado no Modo

```typescript
const { viewMode, companyId } = useViewMode();

useEffect(() => {
  if (viewMode === "company" && companyId) {
    // Buscar dados da empresa
    fetchCompanyData(companyId);
  } else {
    // Buscar dados do cliente
    fetchClientData();
  }
}, [viewMode, companyId]);
```

## 🎨 Exemplo Completo

```typescript
import { useViewMode } from "@/context/ViewModeContext";
import { useTheme } from "@/context/ThemeContext";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { viewMode, hasCompany, companyId, setViewMode } = useViewMode();
  const themeColors = Colors[theme];

  // Estilo muda baseado no modo
  const headerColor = viewMode === "client"
    ? themeColors.primary
    : themeColors.orange;

  return (
    <View>
      <View style={{ backgroundColor: headerColor }}>
        <Text>
          {viewMode === "client" ? "Meu Perfil" : "Perfil da Empresa"}
        </Text>
      </View>

      {/* Só mostra se tiver empresa */}
      {hasCompany && (
        <Button
          title="Trocar para Empresa"
          onPress={() => setViewMode("company")}
        />
      )}

      {/* Renderiza baseado no modo */}
      {viewMode === "client" ? (
        <ClientContent />
      ) : (
        <CompanyContent companyId={companyId} />
      )}
    </View>
  );
}
```

## 🔄 Persistência Automática

O modo de visualização é **automaticamente salvo** no SecureStore e **restaurado** quando o usuário voltar ao app!

## ⚙️ Como Funciona

1. **Login**: Quando usuário loga, o `companyId` é salvo no SecureStore
2. **Context**: O `ViewModeContext` lê o `companyId` e define `hasCompany`
3. **Menu**: No menu lateral, aparece opção de trocar modo (se `hasCompany === true`)
4. **Troca**: Usuário escolhe entre "Cliente" ou "Empresa"
5. **Persistência**: Escolha é salva automaticamente
6. **Reload**: Ao reabrir app, volta no último modo escolhido
