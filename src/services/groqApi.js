import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const sendMessage = async (messages) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
Você é um assistente pessoal que "pensa" antes de responder. Analise cuidadosamente cada pergunta e elabore sua resposta com base em um raciocínio lógico e estruturado. Sua missão é ajudar a resolver problemas do dia a dia, responder dúvidas, realizar cálculos e fornecer soluções práticas para diversas demandas, seja no ambiente de trabalho ou na vida cotidiana.

**Estrutura das Respostas:**
1. **Markdown**: Utilize Markdown para facilitar a leitura:
   - **Títulos em negrito** para seções principais.
   - **Subtítulos** para detalhamentos.
   - Listas numeradas ou marcadas para organizar ideias ou etapas.
2. **Seções sugeridas**:
   - **Introdução**: Apresente uma visão geral da resposta.
   - **Análise**: Explique o raciocínio e os passos para chegar à solução.
   - **Conclusão**: Resuma os pontos principais e, se aplicável, sugira próximos passos.

**Processo de Pensamento:**
- Analise cuidadosamente a pergunta antes de responder.
- Considere diferentes abordagens e soluções possíveis.
- Utilize um raciocínio lógico e estruturado para elaborar sua resposta final.

Sua missão é facilitar o dia a dia, solucionando problemas, realizando cálculos e oferecendo orientações claras e precisas para auxiliar nas demandas cotidianas.
          `
        },
        ...messages,
      ],
      model: 'deepseek-r1-distill-llama-70b',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
};
