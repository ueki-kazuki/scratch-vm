const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const net = require('net');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

/**
 * Direction
 * @type {number}
 */
 const CHaserDirection = {
    UP: 1,
    DOWN: 7,
    LEFT: 3,
    RIGHT: 5
}

/**
 * Cell Type
 * @type {number}
 */
 const CHaserCellType = {
    NONE: 0,
    ENEMY: 1,
    BLOCK: 2,
    ITEM: 3
}


/**
 * Class for CHaser Client
 */
class CHaserClient {

    constructor () {
        this.response = "";
        this.values = [];
        this.websocketPromises = [];
        this._isGameSet = false;

        // this をCHaserClientのインスタンスにbind
        this.newSocketCallback = this.newSocketCallback.bind(this);
        this.initCallback = this.initCallback.bind(this);
        this.sendCallback = this.sendCallback.bind(this);
        this.messageCallback = this.messageCallback.bind(this);
    }

    // https://qiita.com/Zumwalt/items/060ae7654c9dfe538ee7
    connect(host, port, name) {
        //. 接続
        const p = new Promise(this.newSocketCallback)
        p.then((event) => {
            this.client = event.target;
            console.log( '接続: ' + host + ':' + port + ':' + name);
            console.log(event);
            this.client.send(['connect', host, port, name].join(" "));

            //. 接続が切断されたら、その旨をメッセージで表示する
            this.client.onclose = function(){
                console.log('切断');
            }
        }).catch((error) => {
            console.log('onerror: ' + error);
        });
        return p;
    }

    getReady() {
        const p = new Promise((resolve) => {
            this.websocketPromises.push(resolve);
            this.client.send("gr");
            this.client.onmessage = this.messageCallback;
        })
            .then(this.sendCallback);
        const values = this.response.split("")
        this.values = values.slice(1);
        return p;
    }

    getValues() {
        return this.values;
    }

    _send(command) {
        log.log(command);
        const p = new Promise(this.initCallback)
            .then(this.sendCallback);
        const values = this.response.split("")
        this.values = values.slice(1);
        return p;
    }

    newSocketCallback(resolve, reject) {
        this.client = new WebSocket("ws://localhost:8080/ws");
        this.client.addEventListener('open', resolve);
        this.client.addEventListener('error', reject);
    }

    initCallback(resolve) {
        this.websocketPromises.push(resolve);
        this.client.send(command);
        this.client.onmessage = this.messageCallback;
    }

    messageCallback(event) {
        console.log('messageCallback: ' + event);
        if (event.data[0] == '0') {
            this.client.close();
            this._isGameSet = true;
        }
        this.response = event.data;
        for(i = 0; i < this.websocketPromises.length; i++) {
            resolve = this.websocketPromises[i];
            resolve();
        }
        this.websocketPromises = [];
    }

    sendCallback() {
        console.log('sendCallback: ' + this.response);
    }

    walk(direction) {
        command = direction == 1 ? 'wu'
                : direction == 3 ? 'wl'
                : direction == 5 ? 'wr'
                : direction == 7 ? 'wd'
                : 'error';
        return this._send(command);
    }

    put(direction) {
        command = direction == 1 ? 'pu'
                : direction == 3 ? 'pl'
                : direction == 5 ? 'pr'
                : direction == 7 ? 'pd'
                : 'error';
        return this._send(command);
    }

    isGameSet() {
        return this._isGameSet;
    }
}

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3CHaser {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    /**
     * @return {array} - text and values for each cells types
     */
     get CELL_TYPE_MENU () {
        return [
            { text: 'なし', value: 0 },
            { text: '相手', value: 1 },
            { text: 'ブロック', value: 2 },
            { text: 'アイテム', value: 3 }
        ]
    }

    /**
     * @return {array} - text and values for each cells element
     */
     get DIRECTION_MENU8 () {
        return [
            { value: 0, text: '左上' },
            { value: 1, text: '上' },
            { value: 2, text: '右上' },
            { value: 3, text: '左' },
            { value: 5, text: '右', },
            { value: 6, text: '左下' },
            { value: 7, text: '下' },
            { value: 8, text: '右下' }
        ]
    }

    /**
     * @return {array} - text and values for each walk action menu element
     */
    get DIRECTION_MENU4 () {
        return [
            { value: 1, text: '上' },
            { value: 3, text: '左' },
            { value: 5, text: '右' },
            { value: 7, text: '下' }
        ]
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'chaser',
            name: 'CHaser',
            // menuIconURI: menuIconURI,
            // blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: 'サーバー [HOST] に [PORT] に [NAME] という名前で接続する',
                    arguments: {
                        HOST: {
                            type: ArgumentType.STRING,
                            defaultValue: '127.0.0.1'
                        },
                        PORT: {
                            type: ArgumentType.NUMBER,
                            menu: 'port',
                            defaultValue: 2009
                        },
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ユーザー１'
                        }
                    }
                },
                {
                    opcode: 'isGameSet',
                    blockType: BlockType.BOOLEAN,
                    text: 'ゲーム終了？'
                },
                {
                    opcode: 'getReady',
                    blockType: BlockType.COMMAND,
                    text: '準備する'

                },
                {
                    opcode: 'isValueEqual',
                    blockType: BlockType.BOOLEAN,
                    text: '[DIRECTION] のマスが [CELL_TYPE]？',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.NUMBER,
                            menu: 'direction8',
                            defaultValue: CHaserDirection.UP
                        },
                        CELL_TYPE: {
                            type: ArgumentType.NUMBER,
                            menu: 'cellType',
                            defaultValue: CHaserCellType.BLOCK
                        }
                    }
                },
                {
                    opcode: 'walk',
                    blockType: BlockType.COMMAND,
                    text: '[DIRECTION] に歩く',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.NUMBER,
                            menu: 'direction4',
                            defaultValue: CHaserDirection.UP
                        }
                    }
                },
                {
                    opcode: 'put',
                    blockType: BlockType.COMMAND,
                    text: '[DIRECTION] にブロックを置く',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.NUMBER,
                            menu: 'direction4',
                            defaultValue: CHaserDirection.UP
                        }
                    }
                },
                // {
                //     opcode: 'search',
                //     blockType: BlockType.COMMAND,
                //     text: '[DIRECTION] の直線方向を調べる',
                //     arguments: {
                //         DIRECTION: {
                //             type: ArgumentType.NUMBER,
                //             menu: 'direction4',
                //             defaultValue: CHaserDirection.UP
                //         }
                //     }
                // },
                // {
                //     opcode: 'look',
                //     blockType: BlockType.COMMAND,
                //     text: '[DIRECTION] の正方形範囲を調べる',
                //     arguments: {
                //         DIRECTION: {
                //             type: ArgumentType.NUMBER,
                //             menu: 'direction4',
                //             defaultValue: CHaserDirection.UP
                //         }
                //     }
                // },
                {
                    opcode: 'getGameSet',
                    blockType: BlockType.REPORTER,
                    text: 'ゲーム終了'
                },
                {
                    opcode: 'getValues',
                    blockType: BlockType.REPORTER,
                    text: 'ボット周辺のセル'
                }
            ],
            menus: {
                port: {
                    acceptReporters: false,
                    items: [
                        {text:'Cool', value: 2009},
                        {text:'Hot', value: 2010}
                    ]
                },
                cellType: {
                    acceptReporters: false,
                    items: this.CELL_TYPE_MENU
                },
                direction8: {
                    acceptReporters: false,
                    items: this.DIRECTION_MENU8
                },
                direction4: {
                    acceptReporters: false,
                    items: this.DIRECTION_MENU4
                }
            }
        };
    }

    /**
     * Connect to CHaser server.
     * CHaserサーバーへのconnectが終わるまでブロックの進行を待ちたいためPromiseオブジェクトを返す
     * @param {object} args - the arguments.
     * @property {string} HOST - hostname or ip address for CHaser server.
     * @property {number} PORT - the port number.
     * @property {string} NAME - username.
     * @return {Promise} A promise that will resolve when getReady is complete.
     */
    connect (args) {
        const host = Cast.toString(args.HOST);
        const port = Cast.toNumber(args.PORT);
        const name = Cast.toString(args.NAME);
        log.log(host, port, name);
        this.client = new CHaserClient()
        return this.client.connect(host, port, name);
    }

    /**
     * Do getReady.
     * getReady()が終わるまでブロックの進行を待ちたいためPromiseオブジェクトを返す
     * @return {Promise} A promise that will resolve when getReady is complete.
     */
    getReady () {
        const promise = this.client.getReady()
        this.values = this.client.getValues()
        return promise;
    }

    /**
     * Return True if the game is set.
     * @return {boolean}
     */
     isGameSet () {
        return this.client.isGameSet();
     }

     /**
     * Return True if a value around the bot equal to specified cell type.
     * @param {object} args - the arguments.
     * @property {number} DIRECTION - the direction.
     * @property {number} CELL_TYPE - the cell type.
     * @return {boolean}
     */
    isValueEqual (args) {
        const direction = Cast.toNumber(args.DIRECTION);
        const cell_type = Cast.toNumber(args.CELL_TYPE);

        if (typeof(this.values) == "undefined") {
            return false;
        }
        const theCell = parseInt(this.values[direction]);
        log.log(this.values, direction, theCell, cell_type);
        log.log(theCell === cell_type);

        return theCell === cell_type;
     }

    /**
     * Walk
     * 行動が終わるまでブロックの進行を待ちたいためPromiseオブジェクトを返す
     * @param {object} args - the arguments.
     * @property {number} DIRECTION - the direction.
     * @return {Promise} A promise that will resolve when Walk is complete.
     */
    walk (args) {
        const direction = Cast.toNumber(args.DIRECTION);
        const promise = this.client.walk(direction);
        this.values = this.client.getValues();
        return promise;
    }

    /**
     * Put
     * 行動が終わるまでブロックの進行を待ちたいためPromiseオブジェクトを返す
     * @param {object} args - the arguments.
     * @property {number} DIRECTION - the direction.
     * @return {Promise} A promise that will resolve when Put is complete.
     */
    put (args) {
        const direction = Cast.toNumber(args.DIRECTION);
        const promise = this.client.put(direction);
        this.values = this.client.getValues();
        return promise;
    }

    /**
     * Get a GameSet variable.
     * @return {boolean} - true if the game is set
     */
    getGameSet () {
        return this.client.isGameSet();
    }

    /**
     * Get values arround the bot.
     * @return {array} - cell values arroud the bot.
     */
    getValues () {
        if (typeof(this.values) == "undefined") {
            return ""
        }
        return this.values.join(",");
    }

    /**
     * Get the browser.
     * @return {number} - the user agent.
     */
    getBrowser () {
        return navigator.userAgent;
    }
}

module.exports = Scratch3CHaser;