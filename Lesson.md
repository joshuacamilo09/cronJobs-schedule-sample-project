# O problema que cron jobs reoslvem

Em app reais, nem tudo acontece por request HTTP. Exemplos: 

- enviar emails automaticos todo os dias as 8
- gerar relatórios semanais 
- limpar dados antigos do banco
- Reprocessar pagamentos falhados 
- Sincronizar dados com APIs externas 
- Fechar pedidos expirados 
- Rodar Backups
- Atualizar cache 

* Essas tarefas precisam rodar sozinhas, em horários específicos ou em intervalos regulares. 

É ai que entram cronJobs / schedulers. 


# Cron jobs 

- Uma tarefa é agendada para executar automaticamente em um horario ou intervalo definido. 

No linux, isso é fetio via cron daemon (crond). Exemmplo: 

0 3 * * * /usr/bin/backup.sh -> executa o script todo dia às 03:00 da manhã.


# Scheduler 

- Cron -> baseado em tempo fixo. 
- Scheduler -> Qualquer sistema que agenda tarefas: 

1. Por tempo
2. Por intervalo 
3. Por eventos 
4. Por fila 
6. Por condições


# Tipos de agendamento 

----------------------------------
1. Por horário fixo (cron)

0 0 * * * ->  todo dia à meia-noite
-----------------------------------
2. Por intervalo 

*/5 * * * * -> A cada 5 minutos 
-----------------------------------
3. Delay (uma vez)

Rodar daqui a 10 minutos 
Ex: Recuperação de senha.
-----------------------------------
4. Condicional 

Rodar apenas se existir X 
Ex: Pedidos expirados.
-----------------------------------


# Sintaxe de CRON (importante dominar)

┌──────── minute (0 - 59)
│ ┌────── hour (0 - 23)
│ │ ┌──── day of month (1 - 31)
│ │ │ ┌── month (1 - 12)
│ │ │ │ ┌ day of week (0 - 6)
│ │ │ │ │
* * * * *

Exemplo: 

0 8 * * 1-5   → 08:00 de segunda a sexta
0 0 1 * *     → Todo dia 1 do mês
*/10 * * * *  → A cada 10 minutos


# Obvervalidade

- Todo job profissional precisa:

1. Logs estruturados
2. Métricas 
3. Alertas
4. Status (success/fail)


### Arquitetura final 

[Cron Job]
    ↓
[Order Scheduler]
    ↓
[Order Service]
    ↓
[RabbitMQ Producer]  --->  [RabbitMQ]
                              ↓
                        [Order Consumer]
                              ↓
                         [DB / API]

- Cron não executa lógica pesada
- RabbitMQ garante desacoplamento, retry e escalabilidade


### Por que usar cron + RabbitMQ ao invés de fazer tudo direto no cron?

* Resposta sênior:

“Porque o cron só dispara eventos. O processamento é assíncrono, desacoplado, escalável e tolerante a falhas.”