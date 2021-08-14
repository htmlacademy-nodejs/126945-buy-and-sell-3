'use strict'

module.exports = {
    name: `--help`,
    run() {
      const info = 'Программа запускает http-сервер и формирует файл с данными для API\n\n'+
                    'Гайд:\n'+
                    'service.js <command>\n\n'+      
                    'Команды:\n'+
                    '--version:            выводит номер версии\n'+
                    '--help:               печатает этот текст\n'+
                    '--generate <count>    формирует файл mocks.json\n';

      console.info(info);
    }
};