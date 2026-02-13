export interface TestResult {
  id: string;
  timestamp: string;
  url: string;
  login_sucesso: boolean;
  erros_encontrados: TestError[];
  abas_testadas: TabTest[];
  status: 'pendente' | 'concluido' | 'erro' | 'executando';
  resumo?: TestSummary;
  duracao?: number;
}

export interface TestError {
  tipo: string;
  mensagem: string;
  aba?: string;
  nivel?: string;
  seletor?: string;
}

export interface TabTest {
  nome: string;
  ordem: number;
  url_antes: string;
  url_depois: string;
  screenshot: string;
  erros: TestError[];
  sucesso: boolean;
  tempo_carregamento?: number;
}

export interface TestSummary {
  total_abas_testadas: number;
  abas_com_sucesso: number;
  abas_com_erro: number;
  total_erros: number;
}

export interface TestConfig {
  url: string;
  credenciais: {
    usuario: string;
    senha: string;
  };
  opcoes_teste: {
    headless: boolean;
    timeout: number;
    tempo_espera_entre_clicks: number;
    capturar_screenshots: boolean;
  };
}

export interface TestHistory {
  total_testes: number;
  testes_sucesso: number;
  testes_erro: number;
  ultima_execucao: string;
  taxa_sucesso: number;
}

export interface ChartData {
  date: string;
  tests: number;
  errors: number;
  success: number;
}
