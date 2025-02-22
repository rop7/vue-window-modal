<style>
    .vue-window-modal {
        position: fixed;
        background-color: #f7f7f7;
        box-shadow: 7px 7px 50px 5px rgba(0,0,0,0.13);
        border: 1px solid #8080802b;
        border-radius: 3px;
        display: none;
        max-height: 90vh;
        max-width: 90vw;
    }

    .vue-window-modal .vue-window-modal-header {
        background-color: #585858;
        padding: 5px;
        padding-left: 8px;
        padding-right: 8px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        color: white;
        height: 40px;
        font-size: 16px;
        cursor: -webkit-grab;
        user-select: none;
        font-weight: bold;
    }

    .vue-window-modal .vue-window-modal-header h2 {
        display: inline-block;
        position: relative;
        top: 3px;
    }

    .vue-window-modal .vue-window-modal-header img {
        float: right;
        cursor: pointer;
        position: relative;
        top: 6px;
    }
</style>

<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{width, height, backgroundColor}">
        <div :id="windowId + '-' + 'header'" class="vue-window-modal-header">
            <h2>{{title}}</h2>
            <img src="./close.png" @click="active = false">
        </div>
        <slot name="default"></slot>
    </div>
</template>

<script>

    export default {
        name: 'vue-window-modal',
        data() {
            return {
                windowId: (function(){
                    const one = Math.floor((Math.random() * 1000000) + 1) + ''
                    const two = Math.floor((Math.random() * 1000000) + 1) + ''
                    const three = Math.floor((Math.random() * 1000000) + 1) + ''
                    return  one + two + three
                })()
            }
        },
        props: {
            active: Boolean,
            title: String,
            width: {
                type: String,
                default: '600px'
            },
            height: {
                type: String,
                default: '600px'
            },
            backgroundColor: {
                type: String,
                default: '#f2f2f2'
            }
        },
        methods: {
            getThisWindowAndHeaderElements() {
                return {
                    window: window.document.getElementById(this.windowId),
                    windowHeader: window.document.getElementById(this.windowId + '-' + 'header')
                }
            },
            dragElement(elmnt) {

                var context = this

                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

                const _window = this.getThisWindowAndHeaderElements().window
                const _windowHeader = this.getThisWindowAndHeaderElements().windowHeader

                _windowHeader.onmousedown = dragMouseDown

                function dragMouseDown(e) {
                    e = e || window.event;
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                    _windowHeader.style.cursor = '-webkit-grabbing'
                }

                function elementDrag(e) {
                    e = e || window.event;
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:

                    if (_window.offsetTop < (window.innerHeight - 35)) {
                        _window.style.top = (_window.offsetTop - pos2) + "px";
                    } else context.centerWindow()
                    if (_window.offsetLeft < (window.innerWidth - 35)) {
                        _window.style.left = (_window.offsetLeft - pos1) + "px";
                    } else context.centerWindow()

                }

                function closeDragElement() {
                    /* stop moving when mouse button is released:*/
                    document.onmouseup = null;
                    document.onmousemove = null;
                    _windowHeader.style.cursor = '-webkit-grab'
                }
            },
            getHighestWindow() {
                const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
                const zIndexs = windows.map(el => Number(el.style.zIndex))
                const highest = Math.max.apply(Math, zIndexs)
                return highest
            },
            sendWindowToHighest() {
                this.getThisWindowAndHeaderElements().window.style.zIndex = this.getHighestWindow() + 1
            },
            centerWindow() {
                var myElement = this.getThisWindowAndHeaderElements().window,
                    pageWidth = window.innerWidth,
                    pageHeight = window.innerHeight,
                    myElementWidth = myElement.offsetWidth,
                    myElementHeight = myElement.offsetHeight;
                const diff = this.activeWindows() * 20
                myElement.style.top = (pageHeight / 2) - (myElementHeight / 2) + diff + "px";
                myElement.style.left = (pageWidth / 2) - (myElementWidth / 2) + diff + "px";
            },
            checkTheresIsAnyAnotherCenteredWindow() { // not being used anymore but working well...
                const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
                const centeredWindows = windows.filter(el => {
                    var myElement = el,
                        pageWidth = window.innerWidth,
                        pageHeight = window.innerHeight,
                        myElementWidth = myElement.offsetWidth,
                        myElementHeight = myElement.offsetHeight;

                    return el.style.top === (pageHeight / 2) - (myElementHeight / 2) + "px" &&
                           el.style.left === (pageWidth / 2) - (myElementWidth / 2) + "px"
                })
                return centeredWindows
            },
            activeWindows() {
                const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
                const openedWindows = windows.filter(el => {
                    return el.style.display === 'block'
                })
                return openedWindows.length
            },
            hide() {
                this.getThisWindowAndHeaderElements().window.style.display = 'none'
            },
            show() {
                this.getThisWindowAndHeaderElements().window.style.display = 'block'
            }
        },
        watch: {
            active (newValue) {
                if (newValue) {
                    this.show()
                    this.sendWindowToHighest()
                    this.centerWindow()
                } else {
                    this.hide()
                }
            }
        },
        mounted() {
            
            this.dragElement()
            
            this.getThisWindowAndHeaderElements().window.addEventListener('click', () => {
                this.sendWindowToHighest()
            })

            this.getThisWindowAndHeaderElements().window.style.zIndex = 9999
        
            if (this.active) {
                this.show()
                this.sendWindowToHighest()
                this.centerWindow()
            }
        }
    }

</script>
 