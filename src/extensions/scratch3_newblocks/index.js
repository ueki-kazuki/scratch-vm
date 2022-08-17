const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

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
 * Walk command send to CHaser server
 * @type {string}
 */
const CHaserWalk = {
    UP: 'wu',
    DOWN: 'wd',
    LEFT: 'wl',
    RIGHT: 'wr'
}

/**
 * Put command send to CHaser server
 * @type {string}
 */
const CHaserPut = {
    UP: 'pu',
    DOWN: 'pd',
    LEFT: 'pl',
    RIGHT: 'pr'
}

/**
 * Search command send to CHaser server
 * @type {string}
 */
const CHaserSearch = {
    UP: 'su',
    DOWN: 'sd',
    LEFT: 'sl',
    RIGHT: 'sr'
}

/**
 * Look command send to CHaser server
 * @type {string}
 */
const CHaserLook = {
    UP: 'lu',
    DOWN: 'ld',
    LEFT: 'll',
    RIGHT: 'lr'
}

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
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3NewBlocks {
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
     get VALUE_DIRECTION_MENU () {
        return [
            { text: '左上', value: 0 },
            { text: '上', value: 1 },
            { text: '右上', value: 2 },
            { text: '左', value: 3 },
            { text: '右', value: 5 },
            { text: '左下', value: 6 },
            { text: '下', value: 7 },
            { text: '右下', value: 8 }
        ]
    }

    /**
     * @return {array} - text and values for each walk action menu element
     */
    get WALK_DIRECTION_MENU () {
        return [
            { text: '上', value: 'wu' },
            { text: '下', value: 'wd' },
            { text: '左', value: 'wl' },
            { text: '右', value: 'wr' }
        ]
    }

    /**
     * @return {array} - text and values for each put action menu element
     */
    get PUT_DIRECTION_MENU () {
        return [
            { text: '上', value: 'pu' },
            { text: '下', value: 'pd' },
            { text: '左', value: 'pl' },
            { text: '右', value: 'pr' }
        ]
    }

    /**
     * @return {array} - text and values for each search action menu element
     */
     get SEARCH_DIRECTION_MENU () {
        return [
            { text: '上', value: 'su' },
            { text: '下', value: 'sd' },
            { text: '左', value: 'sl' },
            { text: '右', value: 'sr' }
        ]
    }

    /**
     * @return {array} - text and values for each look action menu element
     */
     get LOOK_DIRECTION_MENU () {
        return [
            { text: '上', value: 'lu' },
            { text: '下', value: 'ld' },
            { text: '左', value: 'll' },
            { text: '右', value: 'lr' }
        ]
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            // menuIconURI: menuIconURI,
            // blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'setHost',
                    blockType: BlockType.COMMAND,
                    text: 'サーバー [HOST] に [BOT_TYPE] で接続する',
                    arguments: {
                        HOST: {
                            type: ArgumentType.STRING,
                            defaultValue: '127.0.0.1'
                        },
                        BOT_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'botType',
                            defaultValue: 'Cool'
                        }
                    }
                },
                {
                    opcode: 'setName',
                    blockType: BlockType.COMMAND,
                    text: '名前は [NAME] にする',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ユーザー１'
                        }
                    }
                },
                {
                    opcode: 'getReady',
                    blockType: BlockType.COMMAND,
                    text: '準備する'

                },
                {
                    opcode: 'isValueEqual',
                    blockType: BlockType.BOOLEAN,
                    text: '[VALUES] のマスが [CELL_TYPE]',
                    arguments: {
                        VALUES: {
                            type: ArgumentType.NUMBER,
                            menu: 'valueDirection',
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
                    opcode: 'getValue',
                    blockType: BlockType.REPORTER,
                    text: '[VALUES] のマス',
                    arguments: {
                        VALUES: {
                            type: ArgumentType.NUMBER,
                            menu: 'valueDirection',
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getCellType',
                    blockType: BlockType.REPORTER,
                    text: '[CELL_TYPE]',
                    arguments: {
                        CELL_TYPE: {
                            type: ArgumentType.NUMBER,
                            menu: 'cellType',
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: 'walk',
                    blockType: BlockType.COMMAND,
                    text: '[DIRECTION] に歩く',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'walkDirection',
                            defaultValue: CHaserWalk.UP
                        }
                    }
                },
                {
                    opcode: 'put',
                    blockType: BlockType.COMMAND,
                    text: '[DIRECTION] にブロックを置く',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'putDirection',
                            defaultValue: CHaserPut.UP
                        }
                    }
                },
                {
                    opcode: 'search',
                    blockType: BlockType.COMMAND,
                    text: '[DIRECTION] の直線方向を調べる',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'searchDirection',
                            defaultValue: CHaserSearch.UP
                        }
                    }
                },
                {
                    opcode: 'look',
                    blockType: BlockType.COMMAND,
                    text: '[DIRECTION] の正方形範囲を調べる',
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'lookDirection',
                            defaultValue: CHaserLook.UP
                        }
                    }
                }
            ],
            menus: {
                botType: {
                    acceptReporters: false,
                    items: ['Cool', 'Hot']
                },
                cellType: {
                    acceptReporters: false,
                    items: this.CELL_TYPE_MENU
                },
                valueDirection: {
                    acceptReporters: false,
                    items: this.VALUE_DIRECTION_MENU
                },
                walkDirection: {
                    acceptReporters: false,
                    items: this.WALK_DIRECTION_MENU
                },
                putDirection: {
                    acceptReporters: false,
                    items: this.PUT_DIRECTION_MENU
                },
                searchDirection: {
                    acceptReporters: false,
                    items: this.SEARCH_DIRECTION_MENU
                },
                lookDirection: {
                    acceptReporters: false,
                    items: this.LOOK_DIRECTION_MENU
                },
            }
        };
    }

    /**
     * Write log.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     */
    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    /**
     * Get the browser.
     * @return {number} - the user agent.
     */
    getBrowser () {
        return navigator.userAgent;
    }
}

module.exports = Scratch3NewBlocks;