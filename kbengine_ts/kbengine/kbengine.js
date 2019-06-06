var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * KBEngine的html5客户端扩展ts版   2.x版本
 * cocos creator 环境下使用方法
 *
 * 注：（下面的是重点）
 *      1、实体声明的命名空间为KBEngine.Entities,与官方的KBEngine不同
 *      2、 @KBEngine.registerEntity()    ///  TODO: <---组件使用@KBEngine.registerComponent()
            export default class Account extends KBEngine.Entity {      ///  TODO: 组件继承自KBEngine.EntityComponent,类名等于服务器(实体/组件)名
                __comps__ = {组件名:组件类型}    ///TODO: 因为组件类型不会从服务器同步，只能获取到EntityComponent，无法获取具体类型，所以需要在实体里进行手动设置，需要代码提示可以手动声明一下
                __init__() {
                    console.log('创建account')
                }
            }
            //这里加入声明用于vscode代码提示
            declare global {
                namespace KBEngine {
                    interface IEntities{
                        Account:new ()=>Account
                    }
                }
            }

 *      3、cocos creator编辑器下会出现KBEngine未找到的问题，不影响运行，如果想去掉，将允许编辑器加载勾选
        4、因为下班了，组件的basecall和cellcall还未测试，改天再继续
 */
/*-----------------------------------------------------------------------------------------
                                            global
-----------------------------------------------------------------------------------------*/
var KBEngine;
(function (KBEngine) {
    KBEngine.CLIENT_VERSION = '2.5.0';
    KBEngine.CLIENT_SCRIPT_VERSION = '0.1.0';
    KBEngine.PACKET_MAX_SIZE = 1500;
    KBEngine.PACKET_MAX_SIZE_TCP = 1460;
    KBEngine.PACKET_MAX_SIZE_UDP = 1472;
    KBEngine.MESSAGE_ID_LENGTH = 2;
    KBEngine.MESSAGE_LENGTH_LENGTH = 2;
    KBEngine.MESSAGE_LENGTH1_LENGTH = 4;
    KBEngine.MESSAGE_MAX_SIZE = 65535;
    KBEngine.CLIENT_NO_FLOAT = 0;
    KBEngine.KBE_FLT_MAX = 3.402823466e+38;
})(KBEngine || (KBEngine = {}));
/**
 * 加上声明避免cocos creator编辑器报错
 */
window['KBEngine'] = KBEngine;
if (!ArrayBuffer['transfer']) {
    ArrayBuffer['transfer'] = function (source, length) {
        var dest = new ArrayBuffer(length);
        if (!(source instanceof ArrayBuffer) || !(dest instanceof ArrayBuffer)) {
            throw new TypeError("ArrayBuffer.transfer, error: Source and destination must be ArrayBuffer instances");
        }
        if (dest.byteLength >= source.byteLength) {
            var buf = new Uint8Array(dest);
            buf.set(new Uint8Array(source), 0);
        }
        else {
            throw new RangeError("ArrayBuffer.transfer, error: destination has not enough space");
        }
        return dest;
    };
}
;
/*-----------------------------------------------------------------------------------------
                                                    number64bits
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    var INT64 = (function () {
        function INT64(lo, hi) {
            this.sign = 1;
            this.lo = lo;
            this.hi = hi;
            if (hi >= 2147483648) {
                this.sign = -1;
                if (this.lo > 0) {
                    this.lo = (4294967296 - this.lo) & 0xffffffff;
                    this.hi = 4294967295 - this.hi;
                }
                else {
                    this.lo = (4294967296 - this.lo) & 0xffffffff;
                    this.hi = 4294967296 - this.hi;
                }
            }
        }
        INT64.prototype.toString = function () {
            var result = "";
            if (this.sign < 0) {
                result += "-";
            }
            var low = this.lo.toString(16);
            var high = this.hi.toString(16);
            if (this.hi > 0) {
                result += high;
                for (var i = 8 - low.length; i > 0; --i) {
                    result += "0";
                }
            }
            result += low;
            return result;
        };
        return INT64;
    }());
    KBEngine.INT64 = INT64;
    __reflect(INT64.prototype, "KBEngine.INT64");
    var UINT64 = (function () {
        function UINT64(lo, hi) {
            this.lo = lo;
            this.hi = hi;
        }
        UINT64.prototype.toString = function () {
            var low = this.lo.toString(16);
            var high = this.hi.toString(16);
            var result = "";
            if (this.hi > 0) {
                result += high;
                for (var i = 8 - low.length; i > 0; --i) {
                    result += "0";
                }
            }
            result += low;
            return result;
        };
        return UINT64;
    }());
    KBEngine.UINT64 = UINT64;
    __reflect(UINT64.prototype, "KBEngine.UINT64");
})(KBEngine || (KBEngine = {}));
(function (KBEngine) {
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        var c = className.split('.');
        Object.defineProperty(prototype, "__class__", {
            value: c[c.length - 1],
            enumerable: false,
            writable: true
        });
        return c[c.length - 1];
    }
    KBEngine.getQualifiedClassName = getQualifiedClassName;
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            debug
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    /** todo 调试输出模块，这里需要根据使用的引擎不同在这里加入判断条件 */
    function INFO_MSG() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.info.apply(console, args);
    }
    KBEngine.INFO_MSG = INFO_MSG;
    function DEBUG_MSG() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.debug.apply(console, args);
    }
    KBEngine.DEBUG_MSG = DEBUG_MSG;
    function ERROR_MSG() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, args);
    }
    KBEngine.ERROR_MSG = ERROR_MSG;
    function WARNING_MSG() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(console, args);
    }
    KBEngine.WARNING_MSG = WARNING_MSG;
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            string
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    function utf8ArrayToString(array) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
    KBEngine.utf8ArrayToString = utf8ArrayToString;
    function stringToUTF8Bytes(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80)
                utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                    | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }
    KBEngine.stringToUTF8Bytes = stringToUTF8Bytes;
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            event
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    var EventInfo = (function () {
        function EventInfo(classinst, callbackfn) {
            this.classinst = classinst;
            this.callbackfn = callbackfn;
        }
        return EventInfo;
    }());
    KBEngine.EventInfo = EventInfo;
    __reflect(EventInfo.prototype, "KBEngine.EventInfo");
    var FiredEvent = (function () {
        function FiredEvent(evtName, evtInfo, ars) {
            this.evtName = evtName;
            this.evtInfo = evtInfo;
            this.ars = ars;
        }
        return FiredEvent;
    }());
    KBEngine.FiredEvent = FiredEvent;
    __reflect(FiredEvent.prototype, "KBEngine.FiredEvent");
    var Events = (function () {
        function Events() {
            this._events = {};
            this._isPause = false;
            this._firedEvents = [];
        }
        Events.prototype.register = function (evtName, classinst, strCallback) {
            var callbackfn = classinst[strCallback];
            if (callbackfn == undefined) {
                KBEngine.ERROR_MSG('export class Event::fire: not found strCallback(' + classinst + ")!" + strCallback);
                return;
            }
            var evtlst = this._events[evtName];
            if (evtlst == undefined) {
                evtlst = [];
                this._events[evtName] = evtlst;
            }
            var info = new EventInfo(classinst, callbackfn);
            evtlst.push(info);
        };
        Events.prototype.deregisterAll = function (classinst) {
            for (var itemkey in this._events) {
                this.deregister(itemkey, classinst);
            }
        };
        Events.prototype.deregister = function (evtName, classinst) {
            var evtlst = this._events[evtName];
            if (!evtlst)
                return;
            for (var i = evtlst.length - 1; i >= 0; i--) {
                var info = evtlst[i];
                if (info.classinst == classinst) {
                    evtlst.splice(i, 1);
                }
            }
        };
        Events.prototype.removeAllFiredEvent = function (classinst) {
            this.removeFiredEvent("", classinst);
        };
        Events.prototype.removeFiredEvent = function (evtName, classinst) {
            var firedEvents = this._firedEvents;
            for (var i = firedEvents.length - 1; i >= 0; i--) {
                var evt = firedEvents[i];
                if ((evtName == "" || evt.evtName == evtName) && evt.evtInfo.classinst == classinst) {
                    firedEvents.splice(i, 1);
                }
            }
        };
        Events.prototype.fire = function (evtName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!evtName) {
                KBEngine.ERROR_MSG('export class Event::fire: not found eventName!');
                return;
            }
            var evtlst = this._events[evtName];
            if (evtlst == undefined) {
                return;
            }
            // let ars = [];
            // for (let i = 0; i < args.length; i++)
            //     ars.push(args[i]);
            for (var i = 0; i < evtlst.length; i++) {
                var info = evtlst[i];
                if (!this._isPause) {
                    info.callbackfn.apply(info.classinst, args || []);
                }
                else {
                    var eobj = new FiredEvent(evtName, info, args || []);
                    this._firedEvents.push(eobj);
                }
                // if (args.length < 1) {
                //     info.callbackfn.apply(info.classinst);
                // }
                // else {
                //     info.callbackfn.apply(info.classinst, args);
                // }
            }
        };
        Events.prototype.pasue = function () {
            this._isPause = true;
        };
        Events.prototype.resume = function () {
            this._isPause = false;
            var firedEvents = this._firedEvents;
            while (firedEvents.length > 0) {
                var evt = firedEvents.shift();
                var info = evt.evtInfo;
                var ars = evt.ars;
                if (ars.length < 1) {
                    info.callbackfn.apply(info.classinst);
                }
                else {
                    info.callbackfn.apply(info.classinst, ars);
                }
            }
        };
        Events.prototype.clear = function () {
            this._events = {};
            this._firedEvents.splice(0, this._firedEvents.length);
        };
        return Events;
    }());
    KBEngine.Events = Events;
    __reflect(Events.prototype, "KBEngine.Events");
    KBEngine.Event = new Events();
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                                memorystream
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    var PackFloatXType = (function () {
        function PackFloatXType() {
            this._unionData = new ArrayBuffer(4);
            this.fv = new Float32Array(this._unionData, 0, 1);
            this.uv = new Uint32Array(this._unionData, 0, 1);
            this.iv = new Int32Array(this._unionData, 0, 1);
        }
        return PackFloatXType;
    }());
    KBEngine.PackFloatXType = PackFloatXType;
    __reflect(PackFloatXType.prototype, "KBEngine.PackFloatXType");
    KBEngine._xPackData = new PackFloatXType();
    KBEngine._yPackData = new PackFloatXType();
    KBEngine._zPackData = new PackFloatXType();
    var MemoryStream = (function () {
        function MemoryStream(size_or_buffer) {
            this.rpos = 0;
            this.wpos = 0;
            if (size_or_buffer instanceof ArrayBuffer) {
                this.buffer = size_or_buffer;
            }
            else {
                this.buffer = new ArrayBuffer(size_or_buffer);
            }
            this.rpos = 0;
            this.wpos = 0;
        }
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.readInt8 = function () {
            var buf = new Int8Array(this.buffer, this.rpos, 1);
            this.rpos += 1;
            return buf[0];
        };
        MemoryStream.prototype.readInt16 = function () {
            var v = this.readUint16();
            if (v >= 32768)
                v -= 65536;
            return v;
        };
        MemoryStream.prototype.readInt32 = function () {
            var v = this.readUint32();
            if (v >= 2147483648)
                v -= 4294967296;
            return v;
        };
        MemoryStream.prototype.readInt64 = function () {
            var lo = this.readUint32();
            var hi = this.readUint32();
            return new KBEngine.INT64(lo, hi);
        };
        MemoryStream.prototype.readUint8 = function () {
            var buf = new Uint8Array(this.buffer, this.rpos, 1);
            this.rpos += 1;
            return buf[0];
        };
        MemoryStream.prototype.readUint16 = function () {
            var buf = new Uint8Array(this.buffer, this.rpos);
            this.rpos += 2;
            return ((buf[1] & 0xff) << 8) + (buf[0] & 0xff);
        };
        MemoryStream.prototype.readUint32 = function () {
            var buf = new Uint8Array(this.buffer, this.rpos);
            this.rpos += 4;
            return (buf[3] << 24) + (buf[2] << 16) + (buf[1] << 8) + buf[0];
        };
        MemoryStream.prototype.readUint64 = function () {
            var lo = this.readUint32();
            var hi = this.readUint32();
            return new KBEngine.UINT64(lo, hi);
        };
        MemoryStream.prototype.readFloat = function () {
            var buf;
            try {
                buf = new Float32Array(this.buffer, this.rpos, 1);
            }
            catch (e) {
                buf = new Float32Array(this.buffer.slice(this.rpos, this.rpos + 4));
            }
            this.rpos += 4;
            return buf[0];
        };
        MemoryStream.prototype.readDouble = function () {
            var buf;
            try {
                buf = new Float64Array(this.buffer, this.rpos, 1);
            }
            catch (e) {
                buf = new Float64Array(this.buffer.slice(this.rpos, this.rpos + 8), 0, 1);
            }
            this.rpos += 8;
            return buf[0];
        };
        MemoryStream.prototype.readString = function () {
            var buf = new Uint8Array(this.buffer, this.rpos);
            var i = 0;
            var s = "";
            while (true) {
                if (buf[i] != 0) {
                    s += String.fromCharCode(buf[i]);
                }
                else {
                    i++;
                    break;
                }
                i++;
                if (this.rpos + i >= this.buffer.byteLength)
                    throw (new Error("export class MemoryStream::readString: rpos(" + (this.rpos + i) + ")>=" +
                        this.buffer.byteLength + " overflow!"));
            }
            this.rpos += i;
            return s;
        };
        MemoryStream.prototype.readBlob = function () {
            var size = this.readUint32();
            var buf = new Uint8Array(this.buffer, this.rpos, size);
            this.rpos += size;
            return buf;
        };
        MemoryStream.prototype.readStream = function () {
            var buf = new Uint8Array(this.buffer, this.rpos, this.buffer.byteLength - this.rpos);
            this.rpos = this.buffer.byteLength;
            return new MemoryStream(buf);
        };
        MemoryStream.prototype.readPackXZ = function () {
            var xPackData = KBEngine._xPackData;
            var zPackData = KBEngine._zPackData;
            xPackData.fv[0] = 0.0;
            zPackData.fv[0] = 0.0;
            xPackData.uv[0] = 0x40000000;
            zPackData.uv[0] = 0x40000000;
            var v1 = this.readUint8();
            var v2 = this.readUint8();
            var v3 = this.readUint8();
            var data = 0;
            data |= (v1 << 16);
            data |= (v2 << 8);
            data |= v3;
            xPackData.uv[0] |= (data & 0x7ff000) << 3;
            zPackData.uv[0] |= (data & 0x0007ff) << 15;
            xPackData.fv[0] -= 2.0;
            zPackData.fv[0] -= 2.0;
            xPackData.uv[0] |= (data & 0x800000) << 8;
            zPackData.uv[0] |= (data & 0x000800) << 20;
            var d = new Array(2);
            d[0] = xPackData.fv[0];
            d[1] = zPackData.fv[0];
            return d;
        };
        MemoryStream.prototype.readPackY = function () {
            var v = this.readUint16();
            var yPackData = KBEngine._yPackData;
            yPackData.uv[0] = 0x40000000;
            yPackData.uv[0] |= (v & 0x7fff) << 12;
            yPackData.fv[0] -= 2.0;
            yPackData.uv[0] |= (v & 0x8000) << 16;
            return yPackData.fv[0];
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.writeInt8 = function (v) {
            var buf = new Int8Array(this.buffer, this.wpos, 1);
            buf[0] = v;
            this.wpos += 1;
        };
        MemoryStream.prototype.writeInt16 = function (v) {
            this.writeInt8(v & 0xff);
            this.writeInt8(v >> 8 & 0xff);
        };
        MemoryStream.prototype.writeInt32 = function (v) {
            for (var i = 0; i < 4; i++)
                this.writeInt8(v >> i * 8 & 0xff);
        };
        MemoryStream.prototype.writeInt64 = function (v) {
            this.writeInt32(v.lo);
            this.writeInt32(v.hi);
        };
        MemoryStream.prototype.writeUint8 = function (v) {
            var buf = new Uint8Array(this.buffer, this.wpos, 1);
            buf[0] = v;
            this.wpos += 1;
        };
        MemoryStream.prototype.writeUint16 = function (v) {
            this.writeUint8(v & 0xff);
            this.writeUint8(v >> 8 & 0xff);
        };
        MemoryStream.prototype.writeUint32 = function (v) {
            for (var i = 0; i < 4; i++)
                this.writeUint8(v >> i * 8 & 0xff);
        };
        MemoryStream.prototype.writeUint64 = function (v) {
            this.writeUint32(v.lo);
            this.writeUint32(v.hi);
        };
        MemoryStream.prototype.writeFloat = function (v) {
            try {
                var buf = new Float32Array(this.buffer, this.wpos, 1);
                buf[0] = v;
            }
            catch (e) {
                var buf = new Float32Array(1);
                buf[0] = v;
                var buf1 = new Uint8Array(this.buffer);
                var buf2 = new Uint8Array(buf.buffer);
                buf1.set(buf2, this.wpos);
            }
            this.wpos += 4;
        };
        MemoryStream.prototype.writeDouble = function (v) {
            try {
                var buf = new Float64Array(this.buffer, this.wpos, 1);
                buf[0] = v;
            }
            catch (e) {
                var buf = new Float64Array(1);
                buf[0] = v;
                var buf1 = new Uint8Array(this.buffer);
                var buf2 = new Uint8Array(buf.buffer);
                buf1.set(buf2, this.wpos);
            }
            this.wpos += 8;
        };
        MemoryStream.prototype.writeBlob = function (v) {
            var size = v.length;
            if (size + 4 > this.space()) {
                KBEngine.ERROR_MSG("memorystream::writeBlob: no free!");
                return;
            }
            this.writeUint32(size);
            var buf = new Uint8Array(this.buffer, this.wpos, size);
            if (typeof (v) == "string") {
                for (var i = 0; i < size; i++) {
                    buf[i] = v.charCodeAt(i);
                }
            }
            else {
                for (var i = 0; i < size; i++) {
                    buf[i] = v[i];
                }
            }
            this.wpos += size;
        };
        MemoryStream.prototype.writeString = function (v) {
            if (v.length > this.space()) {
                KBEngine.ERROR_MSG("memorystream::writeString: no free!");
                return;
            }
            var buf = new Uint8Array(this.buffer, this.wpos);
            var i = 0;
            for (var idx = 0; idx < v.length; idx++) {
                buf[i++] = v.charCodeAt(idx);
            }
            buf[i++] = 0;
            this.wpos += i;
        };
        MemoryStream.prototype.append = function (stream, offset, size) {
            if (size > this.space()) {
                this.buffer = ArrayBuffer['transfer'](this.buffer, this.buffer.byteLength + size * 2);
            }
            var buf = new Uint8Array(this.buffer, this.wpos, size);
            buf.set(new Uint8Array(stream.buffer, offset, size), 0);
            this.wpos += size;
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.readSkip = function (v) {
            this.rpos += v;
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.space = function () {
            return this.buffer.byteLength - this.wpos;
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.length = function () {
            return this.wpos - this.rpos;
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.readEOF = function () {
            return this.buffer.byteLength - this.rpos <= 0;
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.done = function () {
            this.rpos = this.wpos;
        };
        //---------------------------------------------------------------------------------
        MemoryStream.prototype.getbuffer = function () {
            return this.buffer.slice(this.rpos, this.wpos);
        };
        MemoryStream.prototype.setbuffer = function (buffer) {
            this.clear();
            this.buffer = buffer;
        };
        MemoryStream.prototype.size = function () {
            return this.buffer.byteLength;
        };
        MemoryStream.prototype.clear = function () {
            this.rpos = this.wpos = 0;
            if (this.buffer.byteLength > KBEngine.PACKET_MAX_SIZE) {
                this.buffer = new ArrayBuffer(KBEngine.PACKET_MAX_SIZE);
            }
        };
        MemoryStream.prototype.reclaimObject = function () {
            this.clear();
            if (MemoryStream._objects != undefined) {
                MemoryStream._objects.push(this);
            }
        };
        return MemoryStream;
    }());
    KBEngine.MemoryStream = MemoryStream;
    __reflect(MemoryStream.prototype, "KBEngine.MemoryStream");
    (function (MemoryStream) {
        MemoryStream._objects = [];
        function createObject() {
            return MemoryStream._objects.length > 0 ? MemoryStream._objects.pop() : new MemoryStream(KBEngine.PACKET_MAX_SIZE_TCP);
        }
        MemoryStream.createObject = createObject;
    })(MemoryStream = KBEngine.MemoryStream || (KBEngine.MemoryStream = {}));
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                                bundle
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    var Bundle = (function () {
        function Bundle() {
            this.memorystreams = new Array();
            this.numMessage = 0;
            this.messageLengthBuffer = null;
            this.msgtype = null;
            this.messageLength = 0;
            this.stream = KBEngine.MemoryStream.createObject();
        }
        Bundle.createObject = function () {
            return Bundle._objects.length > 0 ? Bundle._objects.pop() : new Bundle();
        };
        //---------------------------------------------------------------------------------
        Bundle.prototype.newMessage = function (msgtype) {
            this.fini(false);
            this.msgtype = msgtype;
            this.numMessage += 1;
            if (this.msgtype.length == -1) {
                this.messageLengthBuffer = new Uint8Array(this.stream.buffer, this.stream.wpos + KBEngine.MESSAGE_ID_LENGTH, 2);
            }
            this.writeUint16(msgtype.id);
            if (this.messageLengthBuffer) {
                this.writeUint16(0);
                this.messageLengthBuffer[0] = 0;
                this.messageLengthBuffer[1] = 0;
                this.messageLength = 0;
            }
        };
        //---------------------------------------------------------------------------------
        Bundle.prototype.writeMsgLength = function (v) {
            if (this.messageLengthBuffer) {
                this.messageLengthBuffer[0] = v & 0xff;
                this.messageLengthBuffer[1] = v >> 8 & 0xff;
            }
        };
        //---------------------------------------------------------------------------------
        Bundle.prototype.fini = function (issend) {
            if (this.numMessage > 0) {
                this.writeMsgLength(this.messageLength);
                if (this.stream)
                    this.memorystreams.push(this.stream);
                this.stream = KBEngine.MemoryStream.createObject();
            }
            if (issend) {
                this.messageLengthBuffer = null;
                this.numMessage = 0;
                this.msgtype = null;
            }
        };
        //---------------------------------------------------------------------------------
        Bundle.prototype.send = function (network) {
            this.fini(true);
            for (var i = 0; i < this.memorystreams.length; i++) {
                var tmpStream = this.memorystreams[i];
                network.send(tmpStream.getbuffer());
            }
            this.reclaimObject();
        };
        //---------------------------------------------------------------------------------
        Bundle.prototype.checkStream = function (v) {
            if (v > this.stream.space()) {
                this.memorystreams.push(this.stream);
                this.stream = KBEngine.MemoryStream.createObject();
            }
            this.messageLength += v;
        };
        //---------------------------------------------------------------------------------
        Bundle.prototype.writeInt8 = function (v) {
            this.checkStream(1);
            this.stream.writeInt8(v);
        };
        Bundle.prototype.writeInt16 = function (v) {
            this.checkStream(2);
            this.stream.writeInt16(v);
        };
        Bundle.prototype.writeInt32 = function (v) {
            this.checkStream(4);
            this.stream.writeInt32(v);
        };
        Bundle.prototype.writeInt64 = function (v) {
            this.checkStream(8);
            this.stream.writeInt64(v);
        };
        Bundle.prototype.writeUint8 = function (v) {
            this.checkStream(1);
            this.stream.writeUint8(v);
        };
        Bundle.prototype.writeUint16 = function (v) {
            this.checkStream(2);
            this.stream.writeUint16(v);
        };
        Bundle.prototype.writeUint32 = function (v) {
            this.checkStream(4);
            this.stream.writeUint32(v);
        };
        Bundle.prototype.writeUint64 = function (v) {
            this.checkStream(8);
            this.stream.writeUint64(v);
        };
        Bundle.prototype.writeFloat = function (v) {
            this.checkStream(4);
            this.stream.writeFloat(v);
        };
        Bundle.prototype.writeDouble = function (v) {
            this.checkStream(8);
            this.stream.writeDouble(v);
        };
        Bundle.prototype.writeString = function (v) {
            this.checkStream(v.length + 1);
            this.stream.writeString(v);
        };
        Bundle.prototype.writeBlob = function (v) {
            this.checkStream(v.length + 4);
            this.stream.writeBlob(v);
        };
        Bundle.prototype.clear = function () {
            for (var i = 0; i < this.memorystreams.length; i++) {
                if (this.stream != this.memorystreams[i])
                    this.memorystreams[i].reclaimObject();
            }
            if (this.stream)
                this.stream.clear();
            else
                this.stream = KBEngine.MemoryStream.createObject();
            this.memorystreams = new Array();
            this.numMessage = 0;
            this.messageLengthBuffer = null;
            this.messageLength = 0;
            this.msgtype = null;
        };
        Bundle.prototype.reclaimObject = function () {
            this.clear();
            if (Bundle._objects != undefined)
                Bundle._objects.push(this);
        };
        Bundle._objects = [];
        return Bundle;
    }());
    KBEngine.Bundle = Bundle;
    __reflect(Bundle.prototype, "KBEngine.Bundle");
    KBEngine.reader = new KBEngine.MemoryStream(0);
    KBEngine.datatype2id = {};
    function mappingDataType() {
        KBEngine.datatype2id = {};
        KBEngine.datatype2id["STRING"] = 1;
        KBEngine.datatype2id["STD::STRING"] = 1;
        KBEngine.datatype2id["UINT8"] = 2;
        KBEngine.datatype2id["BOOL"] = 2;
        KBEngine.datatype2id["DATATYPE"] = 2;
        KBEngine.datatype2id["CHAR"] = 2;
        KBEngine.datatype2id["DETAIL_TYPE"] = 2;
        KBEngine.datatype2id["ENTITYCALL_CALL_TYPE"] = 2;
        KBEngine.datatype2id["UINT16"] = 3;
        KBEngine.datatype2id["UNSIGNED SHORT"] = 3;
        KBEngine.datatype2id["SERVER_ERROR_CODE"] = 3;
        KBEngine.datatype2id["ENTITY_TYPE"] = 3;
        KBEngine.datatype2id["ENTITY_PROPERTY_UID"] = 3;
        KBEngine.datatype2id["ENTITY_METHOD_UID"] = 3;
        KBEngine.datatype2id["ENTITY_SCRIPT_UID"] = 3;
        KBEngine.datatype2id["DATATYPE_UID"] = 3;
        KBEngine.datatype2id["UINT32"] = 4;
        KBEngine.datatype2id["UINT"] = 4;
        KBEngine.datatype2id["UNSIGNED INT"] = 4;
        KBEngine.datatype2id["ARRAYSIZE"] = 4;
        KBEngine.datatype2id["SPACE_ID"] = 4;
        KBEngine.datatype2id["GAME_TIME"] = 4;
        KBEngine.datatype2id["TIMER_ID"] = 4;
        KBEngine.datatype2id["UINT64"] = 5;
        KBEngine.datatype2id["DBID"] = 5;
        KBEngine.datatype2id["COMPONENT_ID"] = 5;
        KBEngine.datatype2id["INT8"] = 6;
        KBEngine.datatype2id["COMPONENT_ORDER"] = 6;
        KBEngine.datatype2id["INT16"] = 7;
        KBEngine.datatype2id["SHORT"] = 7;
        KBEngine.datatype2id["INT32"] = 8;
        KBEngine.datatype2id["INT"] = 8;
        KBEngine.datatype2id["ENTITY_ID"] = 8;
        KBEngine.datatype2id["CALLBACK_ID"] = 8;
        KBEngine.datatype2id["COMPONENT_TYPE"] = 8;
        KBEngine.datatype2id["INT64"] = 9;
        KBEngine.datatype2id["PYTHON"] = 10;
        KBEngine.datatype2id["PY_DICT"] = 10;
        KBEngine.datatype2id["PY_TUPLE"] = 10;
        KBEngine.datatype2id["PY_LIST"] = 10;
        KBEngine.datatype2id["ENTITYCALL"] = 10;
        KBEngine.datatype2id["BLOB"] = 11;
        KBEngine.datatype2id["UNICODE"] = 12;
        KBEngine.datatype2id["FLOAT"] = 13;
        KBEngine.datatype2id["DOUBLE"] = 14;
        KBEngine.datatype2id["VECTOR2"] = 15;
        KBEngine.datatype2id["VECTOR3"] = 16;
        KBEngine.datatype2id["VECTOR4"] = 17;
        KBEngine.datatype2id["FIXED_DICT"] = 18;
        KBEngine.datatype2id["ARRAY"] = 19;
        KBEngine.datatype2id["ENTITYCALL"] = 20;
    }
    KBEngine.mappingDataType = mappingDataType;
    mappingDataType();
    function bindWriter(writer, argType) {
        switch (argType) {
            case KBEngine.datatype2id["UINT8"]: return writer.writeUint8;
            case KBEngine.datatype2id["UINT16"]: return writer.writeUint16;
            case KBEngine.datatype2id["UINT32"]: return writer.writeUint32;
            case KBEngine.datatype2id["UINT64"]: return writer.writeUint64;
            case KBEngine.datatype2id["INT8"]: return writer.writeInt8;
            case KBEngine.datatype2id["INT16"]: return writer.writeInt16;
            case KBEngine.datatype2id["INT32"]: return writer.writeInt32;
            case KBEngine.datatype2id["INT64"]: return writer.writeInt64;
            case KBEngine.datatype2id["FLOAT"]: return writer.writeFloat;
            case KBEngine.datatype2id["DOUBLE"]: return writer.writeDouble;
            case KBEngine.datatype2id["STRING"]: return writer.writeString;
            case KBEngine.datatype2id["FIXED_DICT"]: return writer.writeStream;
            case KBEngine.datatype2id["ARRAY"]: return writer.writeStream;
            default: return writer.writeStream;
        }
    }
    KBEngine.bindWriter = bindWriter;
    function bindReader(argType) {
        switch (argType) {
            case KBEngine.datatype2id["UINT8"]: return KBEngine.reader.readUint8;
            case KBEngine.datatype2id["UINT16"]: return KBEngine.reader.readUint16;
            case KBEngine.datatype2id["UINT32"]: return KBEngine.reader.readUint32;
            case KBEngine.datatype2id["UINT64"]: return KBEngine.reader.readUint64;
            case KBEngine.datatype2id["INT8"]: return KBEngine.reader.readInt8;
            case KBEngine.datatype2id["INT16"]: return KBEngine.reader.readInt16;
            case KBEngine.datatype2id["INT32"]: return KBEngine.reader.readInt32;
            case KBEngine.datatype2id["INT64"]: return KBEngine.reader.readInt64;
            case KBEngine.datatype2id["FLOAT"]: return KBEngine.reader.readFloat;
            case KBEngine.datatype2id["DOUBLE"]: return KBEngine.reader.readDouble;
            case KBEngine.datatype2id["STRING"]: return KBEngine.reader.readString;
            case KBEngine.datatype2id["FIXED_DICT"]: return KBEngine.reader.readStream;
            case KBEngine.datatype2id["ARRAY"]: return KBEngine.reader.readStream;
            default: return KBEngine.reader.readStream;
        }
    }
    KBEngine.bindReader = bindReader;
    var Message = (function () {
        function Message(id, name, length, argsType, args, handler) {
            this.id = id;
            this.name = name;
            this.length = length;
            this.argsType = argsType;
            this.args = args;
            this.handler = handler;
            for (var i = 0; i < args.length; i++) {
                args[i] = bindReader(args[i]);
            }
        }
        Message.prototype.createFromStream = function (msgstream) {
            if (this.args.length <= 0)
                return msgstream;
            var result = new Array(this.args.length);
            for (var i = 0; i < this.args.length; i++) {
                result[i] = this.args[i].call(msgstream);
            }
            return result;
        };
        Message.prototype.handleMessage = function (msgstream) {
            if (this.handler == null) {
                KBEngine.ERROR_MSG("Message::handleMessage: interface(" + this.name + "/" + this.id + ") no implement!");
                return;
            }
            if (this.args.length <= 0) {
                if (this.argsType < 0)
                    this.handler(msgstream);
                else
                    this.handler();
            }
            else {
                this.handler.apply(KBEngine.app, this.createFromStream(msgstream));
            }
        };
        return Message;
    }());
    KBEngine.Message = Message;
    __reflect(Message.prototype, "KBEngine.Message");
    var messages;
    (function (messages) {
        messages.loginapp = {};
        messages.baseapp = {};
        messages.Loginapp_importClientMessages = new Message(5, "importClientMessages", 0, 0, new Array(), null);
        messages.Baseapp_importClientMessages = new Message(207, "importClientMessages", 0, 0, new Array(), null);
        messages.Baseapp_importClientEntityDef = new Message(208, "importClientEntityDef", 0, 0, new Array(), null);
        messages.onImportClientMessages = new Message(518, "onImportClientMessages", -1, -1, new Array(), null);
    })(messages = KBEngine.messages || (KBEngine.messages = {}));
    KBEngine.clientmessages = {};
    KBEngine.bufferedCreateEntityMessages = {};
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            math
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.distance = function (pos) {
            var x = pos.x - this.x;
            var y = pos.y - this.y;
            return Math.sqrt(x * x + y * y);
        };
        Vector2.prototype.add = function (vec2) {
            this.x += vec2.x;
            this.y += vec2.y;
            return this;
        };
        Vector2.prototype.sub = function (vec2) {
            this.x -= vec2.x;
            this.y -= vec2.y;
            return this;
        };
        Vector2.prototype.mul = function (num) {
            this.x *= num;
            this.y *= num;
            return this;
        };
        Vector2.prototype.div = function (num) {
            this.x /= num;
            this.y /= num;
            return this;
        };
        Vector2.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        return Vector2;
    }());
    KBEngine.Vector2 = Vector2;
    __reflect(Vector2.prototype, "KBEngine.Vector2");
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.distance = function (pos) {
            var x = pos.x - this.x;
            var y = pos.y - this.y;
            var z = pos.z - this.z;
            return Math.sqrt(x * x + y * y + z * z);
        };
        //向量加法
        Vector3.prototype.add = function (vec3) {
            this.x += vec3.x;
            this.y += vec3.y;
            this.z += vec3.z;
            return this;
        };
        //向量减法
        Vector3.prototype.sub = function (vec3) {
            this.x -= vec3.x;
            this.y -= vec3.y;
            this.z -= vec3.z;
            return this;
        };
        //向量乘法
        Vector3.prototype.mul = function (num) {
            this.x *= num;
            this.y *= num;
            this.z *= num;
            return this;
        };
        //向量除法
        Vector3.prototype.div = function (num) {
            this.x /= num;
            this.y /= num;
            this.z /= num;
            return this;
        };
        // 向量取反
        Vector3.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        return Vector3;
    }());
    KBEngine.Vector3 = Vector3;
    __reflect(Vector3.prototype, "KBEngine.Vector3");
    var Vector4 = (function () {
        function Vector4(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Vector4.prototype.distance = function (pos) {
            var x = pos.x - this.x;
            var y = pos.y - this.y;
            var z = pos.z - this.z;
            var w = pos.w - this.w;
            return Math.sqrt(x * x + y * y + z * z + w * w);
        };
        Vector4.prototype.add = function (vec4) {
            this.x += vec4.x;
            this.y += vec4.y;
            this.z += vec4.z;
            this.w += vec4.w;
            return this;
        };
        Vector4.prototype.sub = function (vec4) {
            this.x -= vec4.x;
            this.y -= vec4.y;
            this.z -= vec4.z;
            this.w -= vec4.w;
            return this;
        };
        Vector4.prototype.mul = function (num) {
            this.x *= num;
            this.y *= num;
            this.z *= num;
            this.w *= num;
            return this;
        };
        Vector4.prototype.div = function (num) {
            this.x /= num;
            this.y /= num;
            this.z /= num;
            this.w /= num;
            return this;
        };
        Vector4.prototype.neg = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            return this;
        };
        return Vector4;
    }());
    KBEngine.Vector4 = Vector4;
    __reflect(Vector4.prototype, "KBEngine.Vector4");
    function clampf(value, min_inclusive, max_inclusive) {
        if (min_inclusive > max_inclusive) {
            var temp = min_inclusive;
            min_inclusive = max_inclusive;
            max_inclusive = temp;
        }
        return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
    }
    KBEngine.clampf = clampf;
    function int82angle(angle, half) {
        return angle * (Math.PI / (half ? 254.0 : 128.0));
    }
    KBEngine.int82angle = int82angle;
    function angle2int8(v, half) {
        var angle = 0;
        if (!half) {
            //todo 原来写的float(Math.PI)，因为js没有float这个方法所以去掉了
            angle = Math.floor((v * 128.0) / Math.PI + 0.5);
        }
        else {
            angle = clampf(Math.floor((v * 254.0) / Math.PI + 0.5), -128.0, 127.0);
        }
        return angle;
    }
    KBEngine.angle2int8 = angle2int8;
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            entity
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    KBEngine.Entities = {};
    var Entity = (function () {
        function Entity() {
            this.__comps__ = {};
            this.id = 0;
            this.className = "";
            this.position = new KBEngine.Vector3(0, 0, 0);
            this.direction = new KBEngine.Vector3(0, 0, 0);
            this.velocity = 0;
            this.cell = null;
            this.base = null;
            // enterworld之后设置为true
            this.inWorld = false;
            // __init__调用之后设置为true
            this.inited = false;
            // 是否被控制
            this.isControlled = false;
            this.entityLastLocalPos = new KBEngine.Vector3(0.0, 0.0, 0.0);
            this.entityLastLocalDir = new KBEngine.Vector3(0.0, 0.0, 0.0);
            // 玩家是否在地面上
            this.isOnGround = false;
            for (var i in this.__comps__) {
                this[i] = new this.__comps__[i]();
            }
        }
        Entity.prototype.__init__ = function () {
        };
        Entity.prototype.attachComponents = function () {
            for (var i in this.__comps__) {
                this[i].onAttached(this);
            }
        };
        Entity.prototype.getComponents = function (compName, all) {
            if (all === void 0) { all = false; }
            var res = [];
            for (var i in this.__comps__) {
                if (KBEngine.getQualifiedClassName(this.__comps__[i]) === compName) {
                    if (!all) {
                        return this[i];
                    }
                    res.push(this[i]);
                }
            }
            return res;
        };
        Entity.prototype.detachComponents = function () {
            for (var i in this.__comps__) {
                this[i].onDetached(this);
            }
        };
        Entity.prototype.callPropertysSetMethods = function () {
            var currModule = KBEngine.moduledefs[this.className];
            for (var name_1 in currModule.propertys) {
                var propertydata = currModule.propertys[name_1];
                var properUtype = propertydata[0];
                name_1 = propertydata[2];
                var setmethod = propertydata[5];
                var flags = propertydata[6];
                var oldval = this[name_1];
                if (setmethod != null) {
                    // base类属性或者进入世界后cell类属性会触发set_*方法
                    // ED_FLAG_BASE_AND_CLIENT、ED_FLAG_BASE
                    if (flags == 0x00000020 || flags == 0x00000040) {
                        if (this.inited && !this.inWorld)
                            setmethod.call(this, oldval);
                    }
                    else {
                        if (this.inWorld) {
                            if (flags == 0x00000008 || flags == 0x00000010) {
                                if (!this.isPlayer())
                                    continue;
                            }
                            setmethod.call(this, oldval);
                        }
                    }
                }
            }
            ;
        };
        Entity.prototype.onDestroy = function () {
            this.detachComponents();
        };
        Entity.prototype.onControlled = function (bIsControlled) {
        };
        Entity.prototype.isPlayer = function () {
            return this.id == KBEngine.app.entity_id;
        };
        Entity.prototype.baseCall = function (type) {
            // if (params.length < 1) {
            //     ERROR_MSG('Entity::baseCall: not fount interfaceName!');
            //     return;
            // }
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (this.base == undefined) {
                KBEngine.ERROR_MSG('Entity::baseCall: base is None!');
                return;
            }
            var method = KBEngine.moduledefs[this.className].base_methods[type];
            if (method == undefined) {
                KBEngine.ERROR_MSG("Entity::baseCall: The server did not find the def_method(" + this.className + "." + type + ")!");
                return;
            }
            var methodID = method[0];
            var args = method[3];
            if (params.length != args.length) {
                KBEngine.ERROR_MSG("Entity::baseCall: args(" + (params.length - 1) + "!= " + args.length + ") size is error!");
                return;
            }
            this.base.newCall();
            this.base.bundle.writeUint16(0);
            this.base.bundle.writeUint16(methodID);
            try {
                for (var i = 0; i < params.length; i++) {
                    if (args[i].isSameType(params[i])) {
                        args[i].addToStream(this.base.bundle, params[i]);
                    }
                    else {
                        throw new Error("Entity::baseCall: arg[" + i + "] is error!");
                    }
                }
            }
            catch (e) {
                KBEngine.ERROR_MSG(e.toString());
                KBEngine.ERROR_MSG('Entity::baseCall: args is error!');
                this.base.bundle = null;
                return;
            }
            this.base.sendCall();
        };
        Entity.prototype.cellCall = function (type) {
            // if (params.length < 1) {
            //     ERROR_MSG('Entity::cellCall: not fount interfaceName!');
            //     return;
            // }
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (this.cell == undefined) {
                KBEngine.ERROR_MSG('Entity::cellCall: cell is None!');
                return;
            }
            var method = KBEngine.moduledefs[this.className].cell_methods[type];
            if (method == undefined) {
                KBEngine.ERROR_MSG("Entity::cellCall: The server did not find the def_method(" + this.className + "." + type + ")!");
                return;
            }
            var methodID = method[0];
            var args = method[3];
            if (params.length != args.length) {
                KBEngine.ERROR_MSG("Entity::cellCall: args(" + (params.length) + "!= " + args.length + ") size is error!");
                return;
            }
            this.cell.newCall();
            this.cell.bundle.writeUint16(0);
            this.cell.bundle.writeUint16(methodID);
            try {
                for (var i = 0; i < args.length; i++) {
                    if (args[i].isSameType(params[i])) {
                        args[i].addToStream(this.cell.bundle, params[i]);
                    }
                    else {
                        throw new Error("Entity::cellCall: arg[" + i + "] is error!");
                    }
                }
            }
            catch (e) {
                KBEngine.ERROR_MSG(e.toString());
                KBEngine.ERROR_MSG('Entity::cellCall: args is error!');
                this.cell.bundle = null;
                return;
            }
            this.cell.sendCall();
        };
        Entity.prototype.enterWorld = function () {
            KBEngine.INFO_MSG(this.className + '::enterWorld: ' + this.id);
            this.inWorld = true;
            this.onEnterWorld();
            this.onComponentsEnterworld();
            KBEngine.Event.fire("onEnterWorld", this);
        };
        Entity.prototype.onComponentsEnterworld = function () {
            for (var i in this.__comps__) {
                this[i].onEnterWorld();
            }
        };
        Entity.prototype.onComponentsLeaveworld = function () {
            for (var i in this.__comps__) {
                this[i].onLeaveWorld();
            }
        };
        Entity.prototype.onEnterWorld = function () {
        };
        Entity.prototype.leaveWorld = function () {
            KBEngine.INFO_MSG(this.className + '::leaveWorld: ' + this.id);
            this.inWorld = false;
            this.onLeaveWorld();
            this.onComponentsLeaveworld();
            KBEngine.Event.fire("onLeaveWorld", this);
        };
        Entity.prototype.onLeaveWorld = function () {
        };
        Entity.prototype.enterSpace = function () {
            KBEngine.INFO_MSG(this.className + '::enterSpace: ' + this.id);
            this.onEnterSpace();
            KBEngine.Event.fire("onEnterSpace", this);
            // 要立即刷新表现层对象的位置
            KBEngine.Event.fire("set_position", this);
            KBEngine.Event.fire("set_direction", this);
        };
        Entity.prototype.onEnterSpace = function () {
        };
        Entity.prototype.leaveSpace = function () {
            KBEngine.INFO_MSG(this.className + '::leaveSpace: ' + this.id);
            this.onLeaveSpace();
            KBEngine.Event.fire("onLeaveSpace", this);
        };
        Entity.prototype.onLeaveSpace = function () {
        };
        Entity.prototype.set_position = function () {
            KBEngine.DEBUG_MSG(this.className + "::set_position: " + this.position);
            if (this.isPlayer()) {
                KBEngine.app.entityServerPos.x = this.position.x;
                KBEngine.app.entityServerPos.y = this.position.y;
                KBEngine.app.entityServerPos.z = this.position.z;
            }
            KBEngine.Event.fire("set_position", this);
        };
        Entity.prototype.onUpdateVolatileData = function () {
        };
        Entity.prototype.onUpdatePropertys = function (stream) {
            var currModule = KBEngine.moduledefs[KBEngine.getQualifiedClassName(this)];
            var pdatas = currModule.propertys;
            while (stream.length() > 0) {
                var utype = 0, cId = 0;
                if (currModule.usePropertyDescrAlias) {
                    cId = stream.readUint8();
                    utype = stream.readUint8();
                }
                else {
                    cId = stream.readUint16();
                    utype = stream.readUint16();
                }
                if (cId !== 0) {
                    var comp = pdatas[cId];
                    if (this[comp[2]]) {
                        this[comp[2]].onUpdatePropertys(utype, stream, -1);
                    }
                    continue;
                }
                var propertydata = pdatas[utype];
                var setmethod = propertydata[5];
                var flags = propertydata[6];
                if (!propertydata[4]) {
                    if (this[propertydata[2]] && typeof this[propertydata[2]].createFromStream === 'function')
                        this[propertydata[2]].createFromStream(stream, propertydata[0]);
                    continue;
                }
                var val = propertydata[4].createFromStream(stream);
                var oldval = this[propertydata[2]];
                KBEngine.INFO_MSG("KBEngineApp::Client_onUpdatePropertys: " + this.className + "(id=" + this.id + " " + propertydata[2] + ", val=" + val + ")!");
                this[propertydata[2]] = val;
                if (setmethod != null) {
                    // base类属性或者进入世界后cell类属性会触发set_*方法
                    if (flags == 0x00000020 || flags == 0x00000040) {
                        if (this.inited)
                            setmethod.call(this, oldval);
                    }
                    else {
                        if (this.inWorld)
                            setmethod.call(this, oldval);
                    }
                }
            }
        };
        Entity.prototype.set_direction = function (old) {
            KBEngine.DEBUG_MSG(this.className + "::set_direction: " + this.direction);
            KBEngine.Event.fire("set_direction", this);
        };
        Entity.prototype.onRemoteMethodCall = function (stream) {
            var sm = KBEngine.moduledefs[this.className];
            var ComponentID = sm.usePropertyDescrAlias ? stream.readUint8() : stream.readUint16();
            var methodUtype = sm.useMethodDescrAlias ? stream.readUint8() : stream.readUint16();
            if (ComponentID !== 0) {
                var comp = this[sm.propertys[ComponentID][2]];
                if (comp)
                    comp.onRemoteMethodCall(methodUtype, stream);
                return;
            }
            var methoddata = KBEngine.moduledefs[this.className].methods[methodUtype];
            var args = [];
            var argsdata = methoddata[3];
            for (var i = 0; i < argsdata.length; i++) {
                args.push(argsdata[i].createFromStream(stream));
            }
            if (this[methoddata[2]] != undefined) {
                this[methoddata[2]].apply(this, args);
            }
            else {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onRemoteMethodCall: entity(" + this.id + ") not found method(" + methoddata[2] + ")!");
            }
        };
        return Entity;
    }());
    KBEngine.Entity = Entity;
    __reflect(Entity.prototype, "KBEngine.Entity");
    function registerEntity() {
        return function (ctor) {
            var name = KBEngine.getQualifiedClassName(ctor);
            // KBEngine['Entities'] = KBEngine['Entities'] || {}
            KBEngine['Entities'][name] = ctor;
        };
    }
    KBEngine.registerEntity = registerEntity;
})(KBEngine || (KBEngine = {}));
(function (KBEngine) {
    var EntityComponent = (function () {
        function EntityComponent() {
            this.id = 0;
            this.entityComponentPropertyID = 0;
            this.componentType = 0;
            this.ownerID = 0;
            this.owner = null;
            this.className = '';
            this.base = null;
            this.cell = null;
        }
        EntityComponent.prototype.onAttached = function (owner) { };
        EntityComponent.prototype.onDetached = function (owner) { };
        EntityComponent.prototype.onEnterWorld = function () { };
        EntityComponent.prototype.onLeaveWorld = function () { };
        EntityComponent.prototype.baseCall = function (type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var className = this.className;
            if (this.base == undefined) {
                KBEngine.ERROR_MSG('Entity::baseCall: base is None!');
                return;
            }
            var method = KBEngine.moduledefs[className].base_methods[type];
            if (method == undefined) {
                KBEngine.ERROR_MSG("Entity::baseCall: The server did not find the def_method(" + className + "." + type + ")!");
                return;
            }
            var methodID = method[0];
            var args = method[3];
            if (params.length != args.length) {
                KBEngine.ERROR_MSG("Entity::baseCall: args(" + (params.length - 1) + "!= " + args.length + ") size is error!");
                return;
            }
            this.base.newCall();
            this.base.bundle.writeUint16(this.entityComponentPropertyID);
            this.base.bundle.writeUint16(methodID);
            try {
                for (var i = 0; i < params.length; i++) {
                    if (args[i].isSameType(params[i])) {
                        args[i].addToStream(this.base.bundle, params[i]);
                    }
                    else {
                        throw new Error("Entity::baseCall: arg[" + i + "] is error!");
                    }
                }
            }
            catch (e) {
                KBEngine.ERROR_MSG(e.toString());
                KBEngine.ERROR_MSG('Entity::baseCall: args is error!');
                this.base.bundle = null;
                return;
            }
            this.base.sendCall();
        };
        EntityComponent.prototype.cellCall = function (type) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var className = this.className;
            if (this.cell == undefined) {
                KBEngine.ERROR_MSG('Entity::cellCall: cell is None!');
                return;
            }
            var method = KBEngine.moduledefs[className].cell_methods[type];
            if (method == undefined) {
                KBEngine.ERROR_MSG("Entity::cellCall: The server did not find the def_method(" + className + "." + type + ")!");
                return;
            }
            var methodID = method[0];
            var args = method[3];
            if (params.length != args.length) {
                KBEngine.ERROR_MSG("Entity::cellCall: args(" + (params.length) + "!= " + args.length + ") size is error!");
                return;
            }
            this.cell.newCall();
            this.cell.bundle.writeUint16(this.entityComponentPropertyID);
            this.cell.bundle.writeUint16(methodID);
            try {
                for (var i = 0; i < args.length; i++) {
                    if (args[i].isSameType(params[i])) {
                        args[i].addToStream(this.cell.bundle, params[i]);
                    }
                    else {
                        throw new Error("Entity::cellCall: arg[" + i + "] is error!");
                    }
                }
            }
            catch (e) {
                KBEngine.ERROR_MSG(e.toString());
                KBEngine.ERROR_MSG('Entity::cellCall: args is error!');
                this.cell.bundle = null;
                return;
            }
            this.cell.sendCall();
        };
        EntityComponent.prototype.onUpdatePropertys = function (propUtype, stream, maxCount) {
            var className = KBEngine.getQualifiedClassName(this);
            var currModule = KBEngine.moduledefs[className];
            var pdatas = currModule.propertys;
            while (stream.length() > 0 && maxCount-- != 0) {
                var utype = propUtype, cId = 0;
                if (utype === 0) {
                    if (currModule.usePropertyDescrAlias) {
                        cId = stream.readUint8();
                        utype = stream.readUint8();
                    }
                    else {
                        cId = stream.readUint16();
                        utype = stream.readUint16();
                    }
                }
                var propertydata = pdatas[utype];
                var setmethod = propertydata[5];
                var flags = propertydata[6];
                var val = propertydata[4].createFromStream(stream);
                var oldval = this[propertydata[2]];
                KBEngine.INFO_MSG("KBEngineApp::Client_onUpdatePropertys: " + className + "(id=" + this.id + " " + propertydata[2] + ", val=" + val + ")!");
                this[propertydata[2]] = val;
                if (setmethod != null) {
                    // base类属性或者进入世界后cell类属性会触发set_*方法
                    if (flags == 0x00000020 || flags == 0x00000040) {
                        if (this.owner.inited)
                            setmethod.call(this, oldval);
                    }
                    else {
                        if (this.owner.inWorld)
                            setmethod.call(this, oldval);
                    }
                }
            }
        };
        EntityComponent.prototype.onRemoteMethodCall = function (propUtype, stream) {
            var sm = KBEngine.moduledefs[this.className].methods[propUtype];
            var args = [];
            var argsdata = sm[3];
            for (var i = 0; i < argsdata.length; i++) {
                args.push(argsdata[i].createFromStream(stream));
            }
            typeof this[sm[2]] === 'function' && this[sm[2]].apply(this, args);
        };
        EntityComponent.prototype.createFromStream = function (stream, ecpId) {
            this.entityComponentPropertyID = ecpId;
            this.componentType = stream.readInt32();
            this.ownerID = stream.readInt32();
            this.owner = KBEngine.app.entities[this.ownerID];
            //UInt16 ComponentDescrsType;
            stream.readUint16();
            var count = stream.readUint16();
            if (count > 0) {
                this.onUpdatePropertys(0, stream, count);
            }
            this.className = KBEngine.getQualifiedClassName(this);
            this.base = new KBEngine.EntityComponentCall(this.entityComponentPropertyID, this.ownerID, this.className);
            this.base.type = KBEngine.ENTITYCALL_TYPE_BASE;
            this.cell = new KBEngine.EntityComponentCall(this.entityComponentPropertyID, this.ownerID, this.className);
            this.cell.type = KBEngine.ENTITYCALL_TYPE_CELL;
        };
        return EntityComponent;
    }());
    KBEngine.EntityComponent = EntityComponent;
    __reflect(EntityComponent.prototype, "KBEngine.EntityComponent");
    function registerComponent() {
        return function (ctor) {
            var name = KBEngine.getQualifiedClassName(ctor);
            // KBEngine['Entities'] = KBEngine['Entities'] || {}
            KBEngine['Entities'][name] = ctor;
        };
    }
    KBEngine.registerComponent = registerComponent;
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                                EntityCall
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    KBEngine.ENTITYCALL_TYPE_CELL = 0;
    KBEngine.ENTITYCALL_TYPE_BASE = 1;
    var EntityCall = (function () {
        function EntityCall() {
            this.id = 0;
            this.className = '';
            this.type = KBEngine.ENTITYCALL_TYPE_CELL;
            this.networkInterface = KBEngine.app;
            this.bundle = null;
        }
        EntityCall.prototype.isBase = function () {
            return this.type == KBEngine.ENTITYCALL_TYPE_BASE;
        };
        EntityCall.prototype.isCell = function () {
            return this.type == KBEngine.ENTITYCALL_TYPE_CELL;
        };
        EntityCall.prototype.newCall = function () {
            if (this.bundle == null)
                this.bundle = KBEngine.Bundle.createObject();
            if (this.type == KBEngine.ENTITYCALL_TYPE_CELL)
                this.bundle.newMessage(KBEngine.messages['Baseapp_onRemoteCallCellMethodFromClient']);
            else
                this.bundle.newMessage(KBEngine.messages['Entity_onRemoteMethodCall']);
            this.bundle.writeInt32(this.id);
            return this.bundle;
        };
        EntityCall.prototype.sendCall = function (bundle) {
            if (bundle == undefined)
                bundle = this.bundle;
            bundle.send(this.networkInterface);
            if (this.bundle == bundle)
                this.bundle = null;
        };
        return EntityCall;
    }());
    KBEngine.EntityCall = EntityCall;
    __reflect(EntityCall.prototype, "KBEngine.EntityCall");
    var EntityComponentCall = (function (_super) {
        __extends(EntityComponentCall, _super);
        function EntityComponentCall(ecpId, eid, className) {
            var _this = _super.call(this) || this;
            _this.entityComponentPropertyID = 0;
            _this.entityComponentPropertyID = ecpId;
            _this.id = eid;
            _this.className = className;
            return _this;
        }
        return EntityComponentCall;
    }(EntityCall));
    KBEngine.EntityComponentCall = EntityComponentCall;
    __reflect(EntityComponentCall.prototype, "KBEngine.EntityComponentCall");
    var DATATYPE_UINT8 = (function () {
        function DATATYPE_UINT8() {
        }
        DATATYPE_UINT8.prototype.bind = function () {
        };
        DATATYPE_UINT8.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readUint8.call(stream);
        };
        DATATYPE_UINT8.prototype.addToStream = function (stream, v) {
            stream.writeUint8(v);
        };
        DATATYPE_UINT8.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_UINT8.prototype.isSameType = function (v) {
            if (typeof (v) != "number") {
                return false;
            }
            if (v < 0 || v > 0xff) {
                return false;
            }
            return true;
        };
        return DATATYPE_UINT8;
    }());
    KBEngine.DATATYPE_UINT8 = DATATYPE_UINT8;
    __reflect(DATATYPE_UINT8.prototype, "KBEngine.DATATYPE_UINT8");
    var DATATYPE_UINT16 = (function () {
        function DATATYPE_UINT16() {
        }
        DATATYPE_UINT16.prototype.bind = function () {
        };
        DATATYPE_UINT16.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readUint16.call(stream);
        };
        DATATYPE_UINT16.prototype.addToStream = function (stream, v) {
            stream.writeUint16(v);
        };
        DATATYPE_UINT16.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_UINT16.prototype.isSameType = function (v) {
            if (typeof (v) != "number") {
                return false;
            }
            if (v < 0 || v > 0xffff) {
                return false;
            }
            return true;
        };
        return DATATYPE_UINT16;
    }());
    KBEngine.DATATYPE_UINT16 = DATATYPE_UINT16;
    __reflect(DATATYPE_UINT16.prototype, "KBEngine.DATATYPE_UINT16");
    var DATATYPE_UINT32 = (function () {
        function DATATYPE_UINT32() {
        }
        DATATYPE_UINT32.prototype.bind = function () {
        };
        DATATYPE_UINT32.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readUint32.call(stream);
        };
        DATATYPE_UINT32.prototype.addToStream = function (stream, v) {
            stream.writeUint32(v);
        };
        DATATYPE_UINT32.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_UINT32.prototype.isSameType = function (v) {
            if (typeof (v) != "number") {
                return false;
            }
            if (v < 0 || v > 0xffffffff) {
                return false;
            }
            return true;
        };
        return DATATYPE_UINT32;
    }());
    KBEngine.DATATYPE_UINT32 = DATATYPE_UINT32;
    __reflect(DATATYPE_UINT32.prototype, "KBEngine.DATATYPE_UINT32");
    var DATATYPE_UINT64 = (function () {
        function DATATYPE_UINT64() {
        }
        DATATYPE_UINT64.prototype.bind = function () {
        };
        DATATYPE_UINT64.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readUint64.call(stream);
        };
        DATATYPE_UINT64.prototype.addToStream = function (stream, v) {
            stream.writeUint64(v);
        };
        DATATYPE_UINT64.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_UINT64.prototype.isSameType = function (v) {
            return v instanceof KBEngine.UINT64;
        };
        return DATATYPE_UINT64;
    }());
    KBEngine.DATATYPE_UINT64 = DATATYPE_UINT64;
    __reflect(DATATYPE_UINT64.prototype, "KBEngine.DATATYPE_UINT64");
    var DATATYPE_INT8 = (function () {
        function DATATYPE_INT8() {
        }
        DATATYPE_INT8.prototype.bind = function () {
        };
        DATATYPE_INT8.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readInt8.call(stream);
        };
        DATATYPE_INT8.prototype.addToStream = function (stream, v) {
            stream.writeInt8(v);
        };
        DATATYPE_INT8.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_INT8.prototype.isSameType = function (v) {
            if (typeof (v) != "number") {
                return false;
            }
            if (v < -0x80 || v > 0x7f) {
                return false;
            }
            return true;
        };
        return DATATYPE_INT8;
    }());
    KBEngine.DATATYPE_INT8 = DATATYPE_INT8;
    __reflect(DATATYPE_INT8.prototype, "KBEngine.DATATYPE_INT8");
    var DATATYPE_INT16 = (function () {
        function DATATYPE_INT16() {
        }
        DATATYPE_INT16.prototype.bind = function () {
        };
        DATATYPE_INT16.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readInt16.call(stream);
        };
        DATATYPE_INT16.prototype.addToStream = function (stream, v) {
            stream.writeInt16(v);
        };
        DATATYPE_INT16.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_INT16.prototype.isSameType = function (v) {
            if (typeof (v) != "number") {
                return false;
            }
            if (v < -0x8000 || v > 0x7fff) {
                return false;
            }
            return true;
        };
        return DATATYPE_INT16;
    }());
    KBEngine.DATATYPE_INT16 = DATATYPE_INT16;
    __reflect(DATATYPE_INT16.prototype, "KBEngine.DATATYPE_INT16");
    var DATATYPE_INT32 = (function () {
        function DATATYPE_INT32() {
        }
        DATATYPE_INT32.prototype.bind = function () {
        };
        DATATYPE_INT32.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readInt32.call(stream);
        };
        DATATYPE_INT32.prototype.addToStream = function (stream, v) {
            stream.writeInt32(v);
        };
        DATATYPE_INT32.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_INT32.prototype.isSameType = function (v) {
            if (typeof (v) != "number") {
                return false;
            }
            if (v < -0x80000000 || v > 0x7fffffff) {
                return false;
            }
            return true;
        };
        return DATATYPE_INT32;
    }());
    KBEngine.DATATYPE_INT32 = DATATYPE_INT32;
    __reflect(DATATYPE_INT32.prototype, "KBEngine.DATATYPE_INT32");
    var DATATYPE_INT64 = (function () {
        function DATATYPE_INT64() {
        }
        DATATYPE_INT64.prototype.bind = function () {
        };
        DATATYPE_INT64.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readInt64.call(stream);
        };
        DATATYPE_INT64.prototype.addToStream = function (stream, v) {
            stream.writeInt64(v);
        };
        DATATYPE_INT64.prototype.parseDefaultValStr = function (v) {
            return parseInt(v);
        };
        DATATYPE_INT64.prototype.isSameType = function (v) {
            return v instanceof KBEngine.INT64;
        };
        return DATATYPE_INT64;
    }());
    KBEngine.DATATYPE_INT64 = DATATYPE_INT64;
    __reflect(DATATYPE_INT64.prototype, "KBEngine.DATATYPE_INT64");
    var DATATYPE_FLOAT = (function () {
        function DATATYPE_FLOAT() {
        }
        DATATYPE_FLOAT.prototype.bind = function () {
        };
        DATATYPE_FLOAT.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readFloat.call(stream);
        };
        DATATYPE_FLOAT.prototype.addToStream = function (stream, v) {
            stream.writeFloat(v);
        };
        DATATYPE_FLOAT.prototype.parseDefaultValStr = function (v) {
            return parseFloat(v);
        };
        DATATYPE_FLOAT.prototype.isSameType = function (v) {
            return typeof (v) == "number";
        };
        return DATATYPE_FLOAT;
    }());
    KBEngine.DATATYPE_FLOAT = DATATYPE_FLOAT;
    __reflect(DATATYPE_FLOAT.prototype, "KBEngine.DATATYPE_FLOAT");
    var DATATYPE_DOUBLE = (function (_super) {
        __extends(DATATYPE_DOUBLE, _super);
        function DATATYPE_DOUBLE() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DATATYPE_DOUBLE.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readDouble.call(stream);
        };
        DATATYPE_DOUBLE.prototype.addToStream = function (stream, v) {
            stream.writeDouble(v);
        };
        return DATATYPE_DOUBLE;
    }(DATATYPE_FLOAT));
    KBEngine.DATATYPE_DOUBLE = DATATYPE_DOUBLE;
    __reflect(DATATYPE_DOUBLE.prototype, "KBEngine.DATATYPE_DOUBLE");
    var DATATYPE_STRING = (function () {
        function DATATYPE_STRING() {
        }
        DATATYPE_STRING.prototype.bind = function () {
        };
        DATATYPE_STRING.prototype.createFromStream = function (stream) {
            return KBEngine.reader.readString.call(stream);
        };
        DATATYPE_STRING.prototype.addToStream = function (stream, v) {
            stream.writeString(v);
        };
        DATATYPE_STRING.prototype.parseDefaultValStr = function (v) {
            if (typeof (v) == "string")
                return v;
            return "";
        };
        DATATYPE_STRING.prototype.isSameType = function (v) {
            return typeof (v) == "string";
        };
        return DATATYPE_STRING;
    }());
    KBEngine.DATATYPE_STRING = DATATYPE_STRING;
    __reflect(DATATYPE_STRING.prototype, "KBEngine.DATATYPE_STRING");
    var DATATYPE_VECTOR2 = (function () {
        function DATATYPE_VECTOR2() {
        }
        DATATYPE_VECTOR2.prototype.bind = function () {
        };
        DATATYPE_VECTOR2.prototype.createFromStream = function (stream) {
            if (KBEngine.CLIENT_NO_FLOAT) {
                var x = KBEngine.reader.readInt32.call(stream);
                var y = KBEngine.reader.readInt32.call(stream);
                return new KBEngine.Vector2(x, y);
            }
            else {
                var x = KBEngine.reader.readFloat.call(stream);
                var y = KBEngine.reader.readFloat.call(stream);
                return new KBEngine.Vector2(x, y);
            }
        };
        DATATYPE_VECTOR2.prototype.addToStream = function (stream, v) {
            if (KBEngine.CLIENT_NO_FLOAT) {
                stream.writeInt32(v.x);
                stream.writeInt32(v.y);
            }
            else {
                stream.writeFloat(v.x);
                stream.writeFloat(v.y);
            }
        };
        DATATYPE_VECTOR2.prototype.parseDefaultValStr = function (v) {
            return new KBEngine.Vector2(0.0, 0.0);
            ;
        };
        DATATYPE_VECTOR2.prototype.isSameType = function (v) {
            if (!(v instanceof KBEngine.Vector2)) {
                return false;
            }
            return true;
        };
        return DATATYPE_VECTOR2;
    }());
    KBEngine.DATATYPE_VECTOR2 = DATATYPE_VECTOR2;
    __reflect(DATATYPE_VECTOR2.prototype, "KBEngine.DATATYPE_VECTOR2");
    var DATATYPE_VECTOR3 = (function () {
        function DATATYPE_VECTOR3() {
        }
        DATATYPE_VECTOR3.prototype.bind = function () {
        };
        DATATYPE_VECTOR3.prototype.createFromStream = function (stream) {
            if (KBEngine.CLIENT_NO_FLOAT) {
                return new KBEngine.Vector3(KBEngine.reader.readInt32.call(stream), KBEngine.reader.readInt32.call(stream), KBEngine.reader.readInt32.call(stream));
            }
            else {
                return new KBEngine.Vector3(KBEngine.reader.readFloat.call(stream), KBEngine.reader.readFloat.call(stream), KBEngine.reader.readFloat.call(stream));
            }
        };
        DATATYPE_VECTOR3.prototype.addToStream = function (stream, v) {
            if (KBEngine.CLIENT_NO_FLOAT) {
                stream.writeInt32(v.x);
                stream.writeInt32(v.y);
                stream.writeInt32(v.z);
            }
            else {
                stream.writeFloat(v.x);
                stream.writeFloat(v.y);
                stream.writeFloat(v.z);
            }
        };
        DATATYPE_VECTOR3.prototype.parseDefaultValStr = function (v) {
            return new KBEngine.Vector3(0.0, 0.0, 0.0);
        };
        DATATYPE_VECTOR3.prototype.isSameType = function (v) {
            if (!(v instanceof KBEngine.Vector3)) {
                return false;
            }
            return true;
        };
        return DATATYPE_VECTOR3;
    }());
    KBEngine.DATATYPE_VECTOR3 = DATATYPE_VECTOR3;
    __reflect(DATATYPE_VECTOR3.prototype, "KBEngine.DATATYPE_VECTOR3");
    var DATATYPE_VECTOR4 = (function () {
        function DATATYPE_VECTOR4() {
        }
        DATATYPE_VECTOR4.prototype.bind = function () {
        };
        DATATYPE_VECTOR4.prototype.createFromStream = function (stream) {
            if (KBEngine.CLIENT_NO_FLOAT) {
                return new KBEngine.Vector4(KBEngine.reader.readInt32.call(stream), KBEngine.reader.readInt32.call(stream), KBEngine.reader.readInt32.call(stream), KBEngine.reader.readInt32.call(stream));
            }
            else {
                return new KBEngine.Vector4(KBEngine.reader.readFloat.call(stream), KBEngine.reader.readFloat.call(stream), KBEngine.reader.readFloat.call(stream), KBEngine.reader.readFloat.call(stream));
            }
        };
        DATATYPE_VECTOR4.prototype.addToStream = function (stream, v) {
            if (KBEngine.CLIENT_NO_FLOAT) {
                stream.writeInt32(v.x);
                stream.writeInt32(v.y);
                stream.writeInt32(v.z);
                stream.writeInt32(v.w);
            }
            else {
                stream.writeFloat(v.x);
                stream.writeFloat(v.y);
                stream.writeFloat(v.z);
                stream.writeFloat(v.w);
            }
        };
        DATATYPE_VECTOR4.prototype.parseDefaultValStr = function (v) {
            return new KBEngine.Vector4(0.0, 0.0, 0.0, 0.0);
        };
        DATATYPE_VECTOR4.prototype.isSameType = function (v) {
            if (!(v instanceof KBEngine.Vector4)) {
                return false;
            }
            return true;
        };
        return DATATYPE_VECTOR4;
    }());
    KBEngine.DATATYPE_VECTOR4 = DATATYPE_VECTOR4;
    __reflect(DATATYPE_VECTOR4.prototype, "KBEngine.DATATYPE_VECTOR4");
    var DATATYPE_PYTHON = (function () {
        function DATATYPE_PYTHON() {
        }
        DATATYPE_PYTHON.prototype.bind = function () {
        };
        DATATYPE_PYTHON.prototype.createFromStream = function (stream) {
            return stream.readBlob();
        };
        DATATYPE_PYTHON.prototype.addToStream = function (stream, v) {
            stream.writeBlob(v);
        };
        DATATYPE_PYTHON.prototype.parseDefaultValStr = function (v) {
            return new Uint8Array(0);
        };
        DATATYPE_PYTHON.prototype.isSameType = function (v) {
            return false;
        };
        return DATATYPE_PYTHON;
    }());
    KBEngine.DATATYPE_PYTHON = DATATYPE_PYTHON;
    __reflect(DATATYPE_PYTHON.prototype, "KBEngine.DATATYPE_PYTHON");
    var DATATYPE_UNICODE = (function () {
        function DATATYPE_UNICODE() {
        }
        DATATYPE_UNICODE.prototype.bind = function () {
        };
        DATATYPE_UNICODE.prototype.createFromStream = function (stream) {
            return KBEngine.utf8ArrayToString(KBEngine.reader.readBlob.call(stream));
        };
        DATATYPE_UNICODE.prototype.addToStream = function (stream, v) {
            stream.writeBlob(KBEngine.stringToUTF8Bytes(v));
        };
        DATATYPE_UNICODE.prototype.parseDefaultValStr = function (v) {
            if (typeof (v) == "string")
                return v;
            return "";
        };
        DATATYPE_UNICODE.prototype.isSameType = function (v) {
            return typeof (v) == "string";
        };
        return DATATYPE_UNICODE;
    }());
    KBEngine.DATATYPE_UNICODE = DATATYPE_UNICODE;
    __reflect(DATATYPE_UNICODE.prototype, "KBEngine.DATATYPE_UNICODE");
    var DATATYPE_ENTITYCALL = (function () {
        function DATATYPE_ENTITYCALL() {
        }
        DATATYPE_ENTITYCALL.prototype.bind = function () {
        };
        DATATYPE_ENTITYCALL.prototype.createFromStream = function (stream) {
        };
        DATATYPE_ENTITYCALL.prototype.addToStream = function (stream, v) {
        };
        DATATYPE_ENTITYCALL.prototype.parseDefaultValStr = function (v) {
            return new Uint8Array(0);
            ;
        };
        DATATYPE_ENTITYCALL.prototype.isSameType = function (v) {
            return false;
        };
        return DATATYPE_ENTITYCALL;
    }());
    KBEngine.DATATYPE_ENTITYCALL = DATATYPE_ENTITYCALL;
    __reflect(DATATYPE_ENTITYCALL.prototype, "KBEngine.DATATYPE_ENTITYCALL");
    var DATATYPE_BLOB = (function () {
        function DATATYPE_BLOB() {
        }
        DATATYPE_BLOB.prototype.bind = function () {
        };
        DATATYPE_BLOB.prototype.createFromStream = function (stream) {
            var size = KBEngine.reader.readUint32.call(stream);
            var buf = new Uint8Array(stream.buffer, stream.rpos, size);
            stream.rpos += size;
            return buf;
        };
        DATATYPE_BLOB.prototype.addToStream = function (stream, v) {
            stream.writeBlob(v);
        };
        DATATYPE_BLOB.prototype.parseDefaultValStr = function (v) {
            return new Uint8Array(0);
        };
        DATATYPE_BLOB.prototype.isSameType = function (v) {
            return true;
        };
        return DATATYPE_BLOB;
    }());
    KBEngine.DATATYPE_BLOB = DATATYPE_BLOB;
    __reflect(DATATYPE_BLOB.prototype, "KBEngine.DATATYPE_BLOB");
    var DATATYPE_ARRAY = (function () {
        function DATATYPE_ARRAY() {
            this.type = null;
        }
        DATATYPE_ARRAY.prototype.bind = function () {
            if (typeof (this.type) == "number")
                this.type = datatypes[this.type];
        };
        DATATYPE_ARRAY.prototype.createFromStream = function (stream) {
            var size = stream.readUint32();
            var datas = [];
            while (size > 0) {
                size--;
                datas.push(this.type.createFromStream(stream));
            }
            ;
            return datas;
        };
        DATATYPE_ARRAY.prototype.addToStream = function (stream, v) {
            stream.writeUint32(v.length);
            for (var i = 0; i < v.length; i++) {
                this.type.addToStream(stream, v[i]);
            }
        };
        DATATYPE_ARRAY.prototype.parseDefaultValStr = function (v) {
            return [];
        };
        DATATYPE_ARRAY.prototype.isSameType = function (v) {
            for (var i = 0; i < v.length; i++) {
                if (!this.type.isSameType(v[i])) {
                    return false;
                }
            }
            return true;
        };
        return DATATYPE_ARRAY;
    }());
    KBEngine.DATATYPE_ARRAY = DATATYPE_ARRAY;
    __reflect(DATATYPE_ARRAY.prototype, "KBEngine.DATATYPE_ARRAY");
    var DATATYPE_FIXED_DICT = (function () {
        function DATATYPE_FIXED_DICT() {
            this.dicttype = {};
            this.implementedBy = null;
        }
        DATATYPE_FIXED_DICT.prototype.bind = function () {
            for (var itemkey in this.dicttype) {
                var utype = this.dicttype[itemkey];
                if (typeof (this.dicttype[itemkey]) == "number")
                    this.dicttype[itemkey] = datatypes[utype];
            }
        };
        DATATYPE_FIXED_DICT.prototype.createFromStream = function (stream) {
            var datas = {};
            for (var itemkey in this.dicttype) {
                datas[itemkey] = this.dicttype[itemkey].createFromStream(stream);
            }
            return datas;
        };
        DATATYPE_FIXED_DICT.prototype.addToStream = function (stream, v) {
            for (var itemkey in this.dicttype) {
                this.dicttype[itemkey].addToStream(stream, v[itemkey]);
            }
        };
        DATATYPE_FIXED_DICT.prototype.parseDefaultValStr = function (v) {
            return {};
        };
        DATATYPE_FIXED_DICT.prototype.isSameType = function (v) {
            for (var itemkey in this.dicttype) {
                if (!this.dicttype[itemkey].isSameType(v[itemkey])) {
                    return false;
                }
            }
            return true;
        };
        return DATATYPE_FIXED_DICT;
    }());
    KBEngine.DATATYPE_FIXED_DICT = DATATYPE_FIXED_DICT;
    __reflect(DATATYPE_FIXED_DICT.prototype, "KBEngine.DATATYPE_FIXED_DICT");
    var datatypes;
    (function (datatypes) {
        datatypes.UINT8 = new DATATYPE_UINT8();
        datatypes.UINT16 = new DATATYPE_UINT16();
        datatypes.UINT32 = new DATATYPE_UINT32();
        datatypes.UINT64 = new DATATYPE_UINT64();
        datatypes.INT8 = new DATATYPE_INT8();
        datatypes.INT16 = new DATATYPE_INT16();
        datatypes.INT32 = new DATATYPE_INT32();
        datatypes.INT64 = new DATATYPE_INT64();
        datatypes.FLOAT = new DATATYPE_FLOAT();
        datatypes.DOUBLE = new DATATYPE_DOUBLE();
        datatypes.STRING = new DATATYPE_STRING();
        datatypes.VECTOR2 = new DATATYPE_VECTOR2();
        datatypes.VECTOR3 = new DATATYPE_VECTOR3();
        datatypes.VECTOR4 = new DATATYPE_VECTOR4();
        datatypes.PYTHON = new DATATYPE_PYTHON();
        // export const PY_DICT = new DATATYPE_PYTHON();
        // export const PY_LIST = new DATATYPE_PYTHON();
        datatypes.UNICODE = new DATATYPE_UNICODE();
        datatypes.ENTITYCALL = new DATATYPE_ENTITYCALL();
        datatypes.BLOB = new DATATYPE_BLOB();
    })(datatypes = KBEngine.datatypes || (KBEngine.datatypes = {}));
    ;
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            KBEngine args
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    var KBEngineArgs = (function () {
        function KBEngineArgs() {
            this.ip = '127.0.0.1';
            this.port = 20013;
            this.updateHZ = 100;
            this.serverHeartbeatTick = 15;
            this.isWss = false;
            this.forceBasePort = 0;
            // Reference: http://github.io/docs/programming/clientsdkprogramming.html, client types
            this.clientType = 5;
            // 在Entity初始化时是否触发属性的set_*事件(callPropertysSetMethods)
            this.isOnInitCallPropertysSetMethods = true;
        }
        Object.defineProperty(KBEngineArgs.prototype, "protocol", {
            //TODO  wss需要参数，因为服务器不支持wss，需要使用Nginx转发一次，在这里设置强制修改baseapp连接端口到Nginx端口
            get: function () { return this.isWss ? "wss://" : "ws://"; },
            enumerable: true,
            configurable: true
        });
        return KBEngineArgs;
    }());
    KBEngine.KBEngineArgs = KBEngineArgs;
    __reflect(KBEngineArgs.prototype, "KBEngine.KBEngineArgs");
    KBEngine.EventTypes = {
        // Create new account.
        // <para> param1(string): accountName</para>
        // <para> param2(string): password</para>
        // <para> param3(bytes): datas // Datas by user defined. Data will be recorded into the KBE account database, you can access the datas through the script layer. If you use third-party account system, datas will be submitted to the third-party system.</para>
        createAccount: "createAccount",
        // Login to server.
        // <para> param1(string): accountName</para>
        // <para> param2(string): password</para>
        // <para> param3(bytes): datas // Datas by user defined. Data will be recorded into the KBE account database, you can access the datas through the script layer. If you use third-party account system, datas will be submitted to the third-party system.</para>
        login: "login",
        // Logout to baseapp, called when exiting the client.	
        logout: "logout",
        // Relogin to baseapp.
        reloginBaseapp: "reloginBaseapp",
        // Request server binding account Email.
        // <para> param1(string): emailAddress</para>
        bindAccountEmail: "bindAccountEmail",
        // Request to set up a new password for the account. Note: account must be online.
        // <para> param1(string): old_password</para>
        // <para> param2(string): new_password</para>
        newPassword: "newPassword",
        // ------------------------------------连接相关------------------------------------
        // Kicked of the current server.
        // <para> param1(uint16): retcode. // server_errors</para>
        onKicked: "onKicked",
        // Disconnected from the server.
        onDisconnected: "onDisconnected",
        // Status of connection server.
        // <para> param1(bool): success or fail</para>
        onConnectionState: "onConnectionState",
        // ------------------------------------logon相关------------------------------------
        // Create account feedback results.
        // <para> param1(uint16): retcode. // server_errors</para>
        // <para> param2(bytes): datas. // If you use third-party account system, the system may fill some of the third-party additional datas. </para>
        onCreateAccountResult: "onCreateAccountResult",
        // Engine version mismatch.
        // <para> param1(string): clientVersion
        // <para> param2(string): serverVersion
        onVersionNotMatch: "onVersionNotMatch",
        // script version mismatch.
        // <para> param1(string): clientScriptVersion
        // <para> param2(string): serverScriptVersion
        onScriptVersionNotMatch: "onScriptVersionNotMatch",
        // Login failed.
        // <para> param1(uint16): retcode. // server_errors</para>
        onLoginFailed: "onLoginFailed",
        // Login to baseapp.
        onLoginBaseapp: "onLoginBaseapp",
        // Login baseapp failed.
        // <para> param1(uint16): retcode. // server_errors</para>
        onLoginBaseappFailed: "onLoginBaseappFailed",
        // Relogin to baseapp.
        onReloginBaseapp: "onReloginBaseapp",
        // Relogin baseapp success.
        onReloginBaseappSuccessfully: "onReloginBaseappSuccessfully",
        // Relogin baseapp failed.
        // <para> param1(uint16): retcode. // server_errors</para>
        onReloginBaseappFailed: "onReloginBaseappFailed",
        // ------------------------------------实体cell相关事件------------------------------------
        // Entity enter the client-world.
        // <para> param1: Entity</para>
        onEnterWorld: "onEnterWorld",
        // Entity leave the client-world.
        // <para> param1: Entity</para>
        onLeaveWorld: "onLeaveWorld",
        // Player enter the new space.
        // <para> param1: Entity</para>
        onEnterSpace: "onEnterSpace",
        // Player leave the space.
        // <para> param1: Entity</para>
        onLeaveSpace: "onLeaveSpace",
        // Sets the current position of the entity.
        // <para> param1: Entity</para>
        set_position: "set_position",
        // Sets the current direction of the entity.
        // <para> param1: Entity</para>
        set_direction: "set_direction",
        // The entity position is updated, you can smooth the moving entity to new location.
        // <para> param1: Entity</para>
        updatePosition: "updatePosition",
        // The current space is specified by the geometry mapping.
        // Popular said is to load the specified Map Resources.
        // <para> param1(string): resPath</para>
        addSpaceGeometryMapping: "addSpaceGeometryMapping",
        // Server spaceData set data.
        // <para> param1(int32): spaceID</para>
        // <para> param2(string): key</para>
        // <para> param3(string): value</para>
        onSetSpaceData: "onSetSpaceData",
        // Start downloading data.
        // <para> param1(int32): rspaceID</para>
        // <para> param2(string): key</para>
        onDelSpaceData: "onDelSpaceData",
        // Triggered when the entity is controlled or out of control.
        // <para> param1: Entity</para>
        // <para> param2(bool): isControlled</para>
        onControlled: "onControlled",
        // Lose controlled entity.
        // <para> param1: Entity</para>
        onLoseControlledEntity: "onLoseControlledEntity",
        // ------------------------------------数据下载相关------------------------------------
        // Start downloading data.
        // <para> param1(uint16): resouce id</para>
        // <para> param2(uint32): data size</para>
        // <para> param3(string): description</para>
        onStreamDataStarted: "onStreamDataStarted",
        // Receive data.
        // <para> param1(uint16): resouce id</para>
        // <para> param2(bytes): datas</para>
        onStreamDataRecv: "onStreamDataRecv",
        // The downloaded data is completed.
        // <para> param1(uint16): resouce id</para>
        onStreamDataCompleted: "onStreamDataCompleted",
    };
})(KBEngine || (KBEngine = {}));
/*-----------------------------------------------------------------------------------------
                                            KBEngine app
-----------------------------------------------------------------------------------------*/
(function (KBEngine) {
    KBEngine.moduledefs = {};
    var KBEngineApp = (function () {
        function KBEngineApp(args) {
            this.args = args;
            this.username = "testhtml51";
            this.password = "123456";
            this.clientdatas = "";
            this.encryptedKey = "";
            this.loginappMessageImported = false;
            this.baseappMessageImported = false;
            this.serverErrorsDescrImported = false;
            this.entitydefImported = false;
            // 这个参数的选择必须与kbengine_defs.xml::cellapp/aliasEntityID的参数保持一致
            this.useAliasEntityID = true;
            this.serverErrs = {};
            // // 登录loginapp的地址
            // ip: string;
            // port: number;
            // 服务端分配的baseapp地址
            this.baseappIP = '';
            this.baseappPort = 0;
            this.baseappUdpPort = 0;
            this.currMsgID = 0;
            this.currMsgCount = 0;
            this.currMsgLen = 0;
            this.fragmentStream = null;
            this.fragmentDatasFlag = KBEngine.FragmentDataTypes.FRAGMENT_DATA_UNKNOW;
            this.fragmentDatasRemain = 0;
            this.currstate = "create";
            this.currconnect = 'loginapp';
            // 扩展数据
            this.serverdatas = "";
            // 版本信息
            this.serverVersion = "";
            this.serverScriptVersion = "";
            this.serverProtocolMD5 = "";
            this.serverEntityDefMD5 = "";
            this.clientVersion = KBEngine.CLIENT_VERSION;
            this.clientScriptVersion = KBEngine.CLIENT_SCRIPT_VERSION;
            // player的相关信息
            this.entity_uuid = null;
            this.entity_id = 0;
            this.entity_type = "";
            // 当前玩家最后一次同步到服务端的位置与朝向与服务端最后一次同步过来的位置
            this.entityServerPos = new KBEngine.Vector3(0.0, 0.0, 0.0);
            // 客户端所有的实体
            this.entities = {};
            this.entityIDAliasIDList = [];
            this.controlledEntities = [];
            // 空间的信息
            this.spacedata = {};
            this.spaceID = 0;
            this.spaceResPath = "";
            this.isLoadedGeometry = false;
            this.lastTickTime = Date.now();
            this.lastTickCBTime = Date.now();
            this.msgStream = new KBEngine.MemoryStream(KBEngine.PACKET_MAX_SIZE_TCP);
            this.entityclass = {};
            // console.assert(app == null || app == undefined, "Assertion of app not is null");
            KBEngine.app = this;
        }
        KBEngineApp.prototype.resetSocket = function () {
            try {
                if (KBEngine.app.socket != undefined && KBEngine.app.socket != null) {
                    var sock = KBEngine.app.socket;
                    sock.onopen = undefined;
                    sock.onerror = undefined;
                    sock.onmessage = undefined;
                    sock.onclose = undefined;
                    KBEngine.app.socket = null;
                    sock.close();
                }
            }
            catch (e) {
            }
        };
        KBEngineApp.prototype.reset = function () {
            if (KBEngine.app.entities != undefined && KBEngine.app.entities != null) {
                KBEngine.app.clearEntities(true);
            }
            KBEngine.app.resetSocket();
            KBEngine.app.currserver = "loginapp";
            KBEngine.app.currstate = "create";
            KBEngine.app.currconnect = 'loginapp';
            // 扩展数据
            KBEngine.app.serverdatas = "";
            // 版本信息
            KBEngine.app.serverVersion = "";
            KBEngine.app.serverScriptVersion = "";
            KBEngine.app.serverProtocolMD5 = "";
            KBEngine.app.serverEntityDefMD5 = "";
            // app.clientVersion = "1.1.5";
            // app.clientScriptVersion = "0.1.0";
            // player的相关信息
            KBEngine.app.entity_uuid = null;
            KBEngine.app.entity_id = 0;
            KBEngine.app.entity_type = "";
            // 当前玩家最后一次同步到服务端的位置与朝向与服务端最后一次同步过来的位置
            KBEngine.app.entityServerPos = new KBEngine.Vector3(0.0, 0.0, 0.0);
            // 客户端所有的实体
            KBEngine.app.entities = {};
            KBEngine.app.entityIDAliasIDList = [];
            KBEngine.app.controlledEntities = [];
            // 空间的信息
            KBEngine.app.spacedata = {};
            KBEngine.app.spaceID = 0;
            KBEngine.app.spaceResPath = "";
            KBEngine.app.isLoadedGeometry = false;
            var dateObject = new Date();
            KBEngine.app.lastTickTime = dateObject.getTime();
            KBEngine.app.lastTickCBTime = dateObject.getTime();
            KBEngine.mappingDataType();
            // 当前组件类别， 配套服务端体系
            KBEngine.app.component = "client";
        };
        KBEngineApp.prototype.installEvents = function () {
            KBEngine.Event.register(KBEngine.EventTypes.createAccount, KBEngine.app, "createAccount");
            KBEngine.Event.register(KBEngine.EventTypes.login, KBEngine.app, "login");
            KBEngine.Event.register(KBEngine.EventTypes.logout, KBEngine.app, 'logout');
            KBEngine.Event.register(KBEngine.EventTypes.reloginBaseapp, KBEngine.app, "reloginBaseapp");
            KBEngine.Event.register(KBEngine.EventTypes.bindAccountEmail, KBEngine.app, "bindAccountEmail");
            KBEngine.Event.register(KBEngine.EventTypes.newPassword, KBEngine.app, "newPassword");
        };
        KBEngineApp.prototype.uninstallEvents = function () {
            KBEngine.Event.deregister(KBEngine.EventTypes.createAccount, KBEngine.app);
            KBEngine.Event.deregister(KBEngine.EventTypes.login, KBEngine.app);
            KBEngine.Event.deregister(KBEngine.EventTypes.logout, KBEngine.app);
            KBEngine.Event.deregister(KBEngine.EventTypes.reloginBaseapp, KBEngine.app);
            KBEngine.Event.deregister(KBEngine.EventTypes.bindAccountEmail, KBEngine.app);
            KBEngine.Event.deregister(KBEngine.EventTypes.newPassword, KBEngine.app);
        };
        KBEngineApp.prototype.hello = function () {
            var bundle = KBEngine.Bundle.createObject();
            if (KBEngine.app.currserver == "loginapp")
                bundle.newMessage(KBEngine.messages['Loginapp_hello']);
            else
                bundle.newMessage(KBEngine.messages['Baseapp_hello']);
            bundle.writeString(KBEngine.app.clientVersion);
            bundle.writeString(KBEngine.app.clientScriptVersion);
            bundle.writeBlob(KBEngine.app.encryptedKey);
            bundle.send(KBEngine.app);
        };
        KBEngineApp.prototype.player = function () {
            return KBEngine.app.entities[KBEngine.app.entity_id];
        };
        KBEngineApp.prototype.findEntity = function (entityID) {
            return KBEngine.app.entities[entityID];
        };
        KBEngineApp.prototype.connect = function (host, port) {
            // console.assert(app.socket == null, "Assertion of socket not is null");
            try {
                var addr = KBEngine.app.args.protocol + host + ':' + port;
                //todo  应该是在这里设置wss
                KBEngine.app.socket = new WebSocket(addr);
            }
            catch (e) {
                KBEngine.ERROR_MSG('WebSocket init error!');
                KBEngine.Event.fire(KBEngine.EventTypes.onConnectionState, false);
                return;
            }
            KBEngine.app.socket.binaryType = "arraybuffer";
            KBEngine.app.socket.onopen = KBEngine.app.onopen;
            KBEngine.app.socket.onerror = KBEngine.app.onerror_before_onopen;
            KBEngine.app.socket.onmessage = KBEngine.app.onmessage;
            KBEngine.app.socket.onclose = KBEngine.app.onclose;
        };
        KBEngineApp.prototype.disconnect = function () {
            KBEngine.app.resetSocket();
        };
        KBEngineApp.prototype.onopen = function () {
            KBEngine.INFO_MSG('connect success!');
            KBEngine.app.socket.onerror = KBEngine.app.onerror_after_onopen;
            KBEngine.Event.fire(KBEngine.EventTypes.onConnectionState, true);
        };
        KBEngineApp.prototype.onerror_before_onopen = function (evt) {
            KBEngine.ERROR_MSG('connect error:' + evt.data);
            KBEngine.app.resetSocket();
            KBEngine.Event.fire(KBEngine.EventTypes.onConnectionState, false);
        };
        KBEngineApp.prototype.onerror_after_onopen = function (evt) {
            KBEngine.ERROR_MSG('connect error:' + evt.data);
            KBEngine.app.resetSocket();
            KBEngine.Event.fire(KBEngine.EventTypes.onDisconnected);
        };
        KBEngineApp.prototype.onmessage = function (msg) {
            var stream = KBEngine.app.msgStream;
            stream.setbuffer(msg.data);
            stream.wpos = msg.data.byteLength;
            while (stream.length() > 0 || KBEngine.app.fragmentStream != null) {
                if (KBEngine.app.fragmentDatasFlag == KBEngine.FragmentDataTypes.FRAGMENT_DATA_UNKNOW) {
                    if (KBEngine.app.currMsgID == 0) {
                        if (KBEngine.MESSAGE_ID_LENGTH > 1 && stream.length() < KBEngine.MESSAGE_ID_LENGTH) {
                            KBEngine.app.writeFragmentMessage(KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_ID, stream, KBEngine.MESSAGE_ID_LENGTH);
                            break;
                        }
                        KBEngine.app.currMsgID = stream.readUint16();
                    }
                    var msgHandler = KBEngine.clientmessages[KBEngine.app.currMsgID];
                    if (!msgHandler) {
                        KBEngine.app.currMsgID = 0;
                        KBEngine.app.currMsgLen = 0;
                        KBEngine.ERROR_MSG("KBEngineApp::onmessage[" + KBEngine.app.currserver + "]: not found msg(" + KBEngine.app.currMsgID + ")!");
                        break;
                    }
                    var msglen = msgHandler.length;
                    if (KBEngine.app.currMsgLen == 0) {
                        if (msglen == -1) {
                            if (stream.length() < KBEngine.MESSAGE_LENGTH_LENGTH) {
                                KBEngine.app.writeFragmentMessage(KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_LENGTH, stream, KBEngine.MESSAGE_LENGTH_LENGTH);
                                break;
                            }
                            else {
                                msglen = stream.readUint16();
                                KBEngine.app.currMsgLen = msglen;
                                // 扩展长度
                                if (msglen == KBEngine.MESSAGE_MAX_SIZE) {
                                    if (stream.length() < KBEngine.MESSAGE_LENGTH1_LENGTH) {
                                        KBEngine.app.writeFragmentMessage(KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_LENGTH1, stream, KBEngine.MESSAGE_LENGTH1_LENGTH);
                                        break;
                                    }
                                    KBEngine.app.currMsgLen = stream.readUint32();
                                }
                            }
                        }
                        else {
                            KBEngine.app.currMsgLen = msglen;
                        }
                    }
                    if (KBEngine.app.fragmentStream != null && KBEngine.app.fragmentStream.length() >= KBEngine.app.currMsgLen) {
                        msgHandler.handleMessage(KBEngine.app.fragmentStream);
                        KBEngine.app.fragmentStream = null;
                    }
                    else if (stream.length() < KBEngine.app.currMsgLen && stream.length() > 0) {
                        KBEngine.app.writeFragmentMessage(KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_BODY, stream, KBEngine.app.currMsgLen);
                        break;
                    }
                    else {
                        var wpos = stream.wpos;
                        var rpos = stream.rpos + msglen;
                        stream.wpos = rpos;
                        msgHandler.handleMessage(stream);
                        stream.wpos = wpos;
                        stream.rpos = rpos;
                    }
                    KBEngine.app.currMsgID = 0;
                    KBEngine.app.currMsgLen = 0;
                    KBEngine.app.fragmentStream = null;
                }
                else {
                    if (KBEngine.app.mergeFragmentMessage(stream))
                        break;
                }
            }
        };
        KBEngineApp.prototype.writeFragmentMessage = function (FragmentDataType, stream, datasize) {
            var opsize = stream.length();
            KBEngine.app.fragmentDatasRemain = datasize - opsize;
            KBEngine.app.fragmentDatasFlag = FragmentDataType;
            KBEngine.app.fragmentStream = stream;
        };
        KBEngineApp.prototype.mergeFragmentMessage = function (stream) {
            var opsize = stream.length();
            if (opsize == 0)
                return 0;
            var fragmentStream = KBEngine.app.fragmentStream;
            // console.assert(fragmentStream != null);
            if (opsize >= KBEngine.app.fragmentDatasRemain) {
                fragmentStream.append(stream, stream.rpos, KBEngine.app.fragmentDatasRemain);
                switch (KBEngine.app.fragmentDatasFlag) {
                    case KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_ID:
                        KBEngine.app.currMsgID = fragmentStream.readUint16();
                        KBEngine.app.fragmentStream = null;
                        break;
                    case KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_LENGTH:
                        KBEngine.app.currMsgLen = fragmentStream.readUint16();
                        KBEngine.app.fragmentStream = null;
                        break;
                    case KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_LENGTH1:
                        KBEngine.app.currMsgLen = fragmentStream.readUint32();
                        KBEngine.app.fragmentStream = null;
                        break;
                    case KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_BODY:
                    default:
                        break;
                }
                stream.rpos += KBEngine.app.fragmentDatasRemain;
                KBEngine.app.fragmentDatasFlag = KBEngine.FragmentDataTypes.FRAGMENT_DATA_UNKNOW;
                KBEngine.app.fragmentDatasRemain = 0;
                return false;
            }
            else {
                fragmentStream.append(stream, stream.rpos, opsize);
                KBEngine.app.fragmentDatasRemain -= opsize;
                stream.done();
                return true;
            }
        };
        KBEngineApp.prototype.onclose = function () {
            KBEngine.INFO_MSG('connect close:' + KBEngine.app.currserver);
            if (KBEngine.app.currconnect != KBEngine.app.currstate)
                return;
            KBEngine.app.resetSocket();
            KBEngine.Event.fire(KBEngine.EventTypes.onDisconnected);
            //if(app.currserver != "loginapp")
            //	app.reset();
        };
        KBEngineApp.prototype.send = function (msg) {
            KBEngine.app.socket.send(msg);
        };
        KBEngineApp.prototype.close = function () {
            KBEngine.INFO_MSG('KBEngine::close()');
            KBEngine.app.socket.close();
            KBEngine.app.reset();
        };
        KBEngineApp.prototype.update = function () {
            if (KBEngine.app.socket == null)
                return;
            var dateObject = new Date();
            if ((dateObject.getTime() - KBEngine.app.lastTickTime) / 1000 > KBEngine.app.args.serverHeartbeatTick / 2) {
                // 如果心跳回调接收时间小于心跳发送时间，说明没有收到回调
                // 此时应该通知客户端掉线了
                if (KBEngine.app.lastTickCBTime < KBEngine.app.lastTickTime) {
                    KBEngine.ERROR_MSG("sendTick: Receive appTick timeout!");
                    KBEngine.app.socket.close();
                }
                if (KBEngine.app.currserver == "loginapp") {
                    if (KBEngine.messages['Loginapp_onClientActiveTick'] != undefined) {
                        var bundle = KBEngine.Bundle.createObject();
                        bundle.newMessage(KBEngine.messages['Loginapp_onClientActiveTick']);
                        bundle.send(KBEngine.app);
                    }
                }
                else {
                    if (KBEngine.messages['Baseapp_onClientActiveTick'] != undefined) {
                        var bundle = KBEngine.Bundle.createObject();
                        bundle.newMessage(KBEngine.messages['Baseapp_onClientActiveTick']);
                        bundle.send(KBEngine.app);
                    }
                }
                KBEngine.app.lastTickTime = dateObject.getTime();
            }
            KBEngine.app.updatePlayerToServer();
        };
        KBEngineApp.prototype.Client_onAppActiveTickCB = function () {
            // let dateObject = new Date();
            KBEngine.app.lastTickCBTime = Date.now(); //dateObject.getTime();
        };
        KBEngineApp.prototype.serverErr = function (id) {
            var e = KBEngine.app.serverErrs[id];
            if (e == undefined) {
                return "";
            }
            return e.name + " [" + e.descr + "]";
        };
        KBEngineApp.prototype.Client_onImportServerErrorsDescr = function (stream) {
            var size = stream.readUint16();
            while (size > 0) {
                size -= 1;
                var e = new ServerErr();
                e.id = stream.readUint16();
                e.name = KBEngine.utf8ArrayToString(stream.readBlob());
                e.descr = KBEngine.utf8ArrayToString(stream.readBlob());
                KBEngine.app.serverErrs[e.id] = e;
                KBEngine.INFO_MSG("Client_onImportServerErrorsDescr: id=" + e.id + ", name=" + e.name + ", descr=" + e.descr);
            }
        };
        KBEngineApp.prototype.Client_onImportClientSdk = function (stream) {
            var remainingFiles = stream.readInt32();
            var fileName = stream.readString();
            var fileSize = stream.readInt32();
            var fileDatas = stream.readBlob();
            KBEngine.Event.fire("onImportClientSDK", remainingFiles, fileName, fileSize, fileDatas);
        };
        KBEngineApp.prototype.onOpenLoginapp_login = function () {
            KBEngine.INFO_MSG("KBEngineApp::onOpenLoginapp_login: successfully!");
            KBEngine.Event.fire(KBEngine.EventTypes.onConnectionState, true);
            KBEngine.app.currserver = "loginapp";
            KBEngine.app.currstate = "login";
            if (!KBEngine.app.loginappMessageImported) {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages.Loginapp_importClientMessages);
                bundle.send(KBEngine.app);
                KBEngine.app.socket.onmessage = KBEngine.app.Client_onImportClientMessages;
                KBEngine.INFO_MSG("KBEngineApp::onOpenLoginapp_login: start importClientMessages ...");
                KBEngine.Event.fire("Loginapp_importClientMessages");
            }
            else {
                KBEngine.app.onImportClientMessagesCompleted();
            }
        };
        KBEngineApp.prototype.onOpenLoginapp_createAccount = function () {
            KBEngine.Event.fire("onConnectionState", true);
            KBEngine.INFO_MSG("KBEngineApp::onOpenLoginapp_createAccount: successfully!");
            KBEngine.app.currserver = "loginapp";
            KBEngine.app.currstate = "createAccount";
            if (!KBEngine.app.loginappMessageImported) {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages.Loginapp_importClientMessages);
                bundle.send(KBEngine.app);
                KBEngine.app.socket.onmessage = KBEngine.app.Client_onImportClientMessages;
                KBEngine.INFO_MSG("KBEngineApp::onOpenLoginapp_createAccount: start importClientMessages ...");
                KBEngine.Event.fire("Loginapp_importClientMessages");
            }
            else {
                KBEngine.app.onImportClientMessagesCompleted();
            }
        };
        KBEngineApp.prototype.onImportClientMessagesCompleted = function () {
            KBEngine.INFO_MSG("KBEngineApp::onImportClientMessagesCompleted: successfully!");
            KBEngine.app.socket.onmessage = KBEngine.app.onmessage;
            KBEngine.app.hello();
            if (KBEngine.app.currserver == "loginapp") {
                if (!KBEngine.app.serverErrorsDescrImported) {
                    KBEngine.INFO_MSG("KBEngine::onImportClientMessagesCompleted(): send importServerErrorsDescr!");
                    KBEngine.app.serverErrorsDescrImported = true;
                    var bundle = KBEngine.Bundle.createObject();
                    bundle.newMessage(KBEngine.messages['Loginapp_importServerErrorsDescr']);
                    bundle.send(KBEngine.app);
                }
                if (KBEngine.app.currstate == "login")
                    KBEngine.app.login_loginapp(false);
                else if (KBEngine.app.currstate == "resetpassword")
                    KBEngine.app.resetpassword_loginapp(false);
                else
                    KBEngine.app.createAccount_loginapp(false);
                KBEngine.app.loginappMessageImported = true;
            }
            else {
                KBEngine.app.baseappMessageImported = true;
                if (!KBEngine.app.entitydefImported) {
                    KBEngine.INFO_MSG("KBEngineApp::onImportClientMessagesCompleted: start importEntityDef ...");
                    var bundle = KBEngine.Bundle.createObject();
                    bundle.newMessage(KBEngine.messages.Baseapp_importClientEntityDef);
                    bundle.send(KBEngine.app);
                    KBEngine.Event.fire("Baseapp_importClientEntityDef");
                }
                else {
                    KBEngine.app.onImportEntityDefCompleted();
                }
            }
        };
        KBEngineApp.prototype.createDataTypeFromStreams = function (stream, canprint) {
            var aliassize = stream.readUint16();
            KBEngine.INFO_MSG("KBEngineApp::createDataTypeFromStreams: importAlias(size=" + aliassize + ")!");
            while (aliassize > 0) {
                aliassize--;
                KBEngine.app.createDataTypeFromStream(stream, canprint);
            }
            ;
            for (var datatype in KBEngine.datatypes) {
                if (KBEngine.datatypes[datatype] != undefined) {
                    KBEngine.datatypes[datatype].bind();
                }
            }
        };
        KBEngineApp.prototype.createDataTypeFromStream = function (stream, canprint) {
            var utype = stream.readUint16();
            var name = stream.readString();
            var valname = stream.readString();
            var length;
            /* 有一些匿名类型，我们需要提供一个唯一名称放到datatypes中
                如：
                <onRemoveAvatar>
                    <Arg>	ARRAY <of> INT8 </of>		</Arg>
                </onRemoveAvatar>
            */
            if (valname.length == 0)
                length = "Null_" + utype;
            if (canprint)
                KBEngine.INFO_MSG("KBEngineApp::Client_onImportClientEntityDef: importAlias(" + name + ":" + valname + ")!");
            if (name == "FIXED_DICT") {
                var datatype = new KBEngine.DATATYPE_FIXED_DICT();
                var keysize = stream.readUint8();
                datatype.implementedBy = stream.readString();
                while (keysize > 0) {
                    keysize--;
                    var keyname = stream.readString();
                    var keyutype = stream.readUint16();
                    datatype.dicttype[keyname] = keyutype;
                }
                ;
                KBEngine.datatypes[valname] = datatype;
            }
            else if (name == "ARRAY") {
                var uitemtype = stream.readUint16();
                var datatype = new KBEngine.DATATYPE_ARRAY();
                datatype.type = uitemtype;
                KBEngine.datatypes[valname] = datatype;
            }
            else {
                KBEngine.datatypes[valname] = KBEngine.datatypes[name];
            }
            KBEngine.datatypes[utype] = KBEngine.datatypes[valname];
            // 将用户自定义的类型补充到映射表中
            KBEngine.datatype2id[valname] = utype;
        };
        KBEngineApp.prototype.Client_onImportClientEntityDef = function (stream) {
            KBEngine.app.createDataTypeFromStreams(stream, true);
            while (stream.length() > 0) {
                var scriptmodule_name = stream.readString();
                var scriptUtype = stream.readUint16();
                var propertysize = stream.readUint16();
                var methodsize = stream.readUint16();
                var base_methodsize = stream.readUint16();
                var cell_methodsize = stream.readUint16();
                KBEngine.INFO_MSG("KBEngineApp::Client_onImportClientEntityDef: import(" + scriptmodule_name + "), propertys(" + propertysize + "), " +
                    "clientMethods(" + methodsize + "), baseMethods(" + base_methodsize + "), cellMethods(" + cell_methodsize + ")!");
                KBEngine.moduledefs[scriptmodule_name] = {};
                var currModuleDefs = KBEngine.moduledefs[scriptmodule_name];
                currModuleDefs["name"] = scriptmodule_name;
                currModuleDefs["propertys"] = {};
                currModuleDefs["methods"] = {};
                currModuleDefs["base_methods"] = {};
                currModuleDefs["cell_methods"] = {};
                KBEngine.moduledefs[scriptUtype] = currModuleDefs;
                var self_propertys = currModuleDefs["propertys"];
                var self_methods = currModuleDefs["methods"];
                var self_base_methods = currModuleDefs["base_methods"];
                var self_cell_methods = currModuleDefs["cell_methods"];
                var Class = KBEngine['Entities'][scriptmodule_name];
                while (propertysize > 0) {
                    propertysize--;
                    var properUtype = stream.readUint16();
                    var properFlags = stream.readUint32();
                    var aliasID = stream.readInt16();
                    var name_2 = stream.readString();
                    var defaultValStr = stream.readString();
                    var utype = KBEngine.datatypes[stream.readUint16()];
                    var setmethod = null;
                    if (Class != undefined) {
                        setmethod = Class.prototype["set_" + name_2];
                        if (setmethod == undefined)
                            setmethod = null;
                    }
                    var savedata = [properUtype, aliasID, name_2, defaultValStr, utype, setmethod, properFlags];
                    self_propertys[name_2] = savedata;
                    if (aliasID != -1) {
                        self_propertys[aliasID] = savedata;
                        currModuleDefs["usePropertyDescrAlias"] = true;
                    }
                    else {
                        self_propertys[properUtype] = savedata;
                        currModuleDefs["usePropertyDescrAlias"] = false;
                    }
                    KBEngine.INFO_MSG("KBEngineApp::Client_onImportClientEntityDef: add(" + scriptmodule_name + "), property(" + name_2 + "/" + properUtype + ").");
                }
                ;
                while (methodsize > 0) {
                    methodsize--;
                    var methodUtype = stream.readUint16();
                    var aliasID = stream.readInt16();
                    var name_3 = stream.readString();
                    var argssize = stream.readUint8();
                    var args = [];
                    while (argssize > 0) {
                        argssize--;
                        args.push(KBEngine.datatypes[stream.readUint16()]);
                    }
                    ;
                    var savedata = [methodUtype, aliasID, name_3, args];
                    self_methods[name_3] = savedata;
                    if (aliasID != -1) {
                        self_methods[aliasID] = savedata;
                        currModuleDefs["useMethodDescrAlias"] = true;
                    }
                    else {
                        self_methods[methodUtype] = savedata;
                        currModuleDefs["useMethodDescrAlias"] = false;
                    }
                    KBEngine.INFO_MSG("KBEngineApp::Client_onImportClientEntityDef: add(" + scriptmodule_name + "), method(" + name_3 + ").");
                }
                ;
                while (base_methodsize > 0) {
                    base_methodsize--;
                    var methodUtype = stream.readUint16();
                    var aliasID = stream.readInt16();
                    var name_4 = stream.readString();
                    var argssize = stream.readUint8();
                    var args = [];
                    while (argssize > 0) {
                        argssize--;
                        args.push(KBEngine.datatypes[stream.readUint16()]);
                    }
                    ;
                    self_base_methods[name_4] = [methodUtype, aliasID, name_4, args];
                    KBEngine.INFO_MSG("KBEngineApp::Client_onImportClientEntityDef: add(" + scriptmodule_name + "), base_method(" + name_4 + ").");
                }
                ;
                while (cell_methodsize > 0) {
                    cell_methodsize--;
                    var methodUtype = stream.readUint16();
                    var aliasID = stream.readInt16();
                    var name_5 = stream.readString();
                    var argssize = stream.readUint8();
                    var args = [];
                    while (argssize > 0) {
                        argssize--;
                        args.push(KBEngine.datatypes[stream.readUint16()]);
                    }
                    ;
                    self_cell_methods[name_5] = [methodUtype, aliasID, name_5, args];
                    KBEngine.INFO_MSG("KBEngineApp::Client_onImportClientEntityDef: add(" + scriptmodule_name + "), cell_method(" + name_5 + ").");
                }
                ;
                var defmethod = void 0;
                try {
                    defmethod = KBEngine['Entities'][scriptmodule_name];
                }
                catch (e) {
                    KBEngine.ERROR_MSG("KBEngineApp::Client_onImportClientEntityDef: module(" + scriptmodule_name + ") not found!");
                    defmethod = undefined;
                }
                for (var name_6 in currModuleDefs.propertys) {
                    var infos = currModuleDefs.propertys[name_6];
                    var properUtype = infos[0];
                    var aliasID = infos[1];
                    var n = infos[2];
                    var defaultValStr = infos[3];
                    var utype = infos[4];
                    if (defmethod != undefined && utype)
                        defmethod.prototype[n] = utype.parseDefaultValStr(defaultValStr);
                }
                ;
                for (var name_7 in currModuleDefs.methods) {
                    var infos = currModuleDefs.methods[name_7];
                    var properUtype = infos[0];
                    var aliasID = infos[1];
                    var n = infos[2];
                    var args = infos[3];
                    if (defmethod != undefined && defmethod.prototype[n] == undefined) {
                        KBEngine.WARNING_MSG(scriptmodule_name + ":: method(" + n + ") no implement!");
                    }
                }
                ;
            }
            KBEngine.app.onImportEntityDefCompleted();
        };
        KBEngineApp.prototype.Client_onVersionNotMatch = function (stream) {
            KBEngine.app.serverVersion = stream.readString();
            KBEngine.ERROR_MSG("Client_onVersionNotMatch: verInfo=" + KBEngine.app.clientVersion + " not match(server: " + KBEngine.app.serverVersion + ")");
            KBEngine.Event.fire(KBEngine.EventTypes.onVersionNotMatch, KBEngine.app.clientVersion, KBEngine.app.serverVersion);
        };
        KBEngineApp.prototype.Client_onScriptVersionNotMatch = function (stream) {
            KBEngine.app.serverScriptVersion = stream.readString();
            KBEngine.ERROR_MSG("Client_onScriptVersionNotMatch: verInfo=" + KBEngine.app.clientScriptVersion + " not match(server: " + KBEngine.app.serverScriptVersion + ")");
            KBEngine.Event.fire(KBEngine.EventTypes.onScriptVersionNotMatch, KBEngine.app.clientScriptVersion, KBEngine.app.serverScriptVersion);
        };
        KBEngineApp.prototype.onImportEntityDefCompleted = function () {
            KBEngine.INFO_MSG("KBEngineApp::onImportEntityDefCompleted: successfully!");
            KBEngine.app.entitydefImported = true;
            KBEngine.app.login_baseapp(false);
        };
        KBEngineApp.prototype.importClientMessages = function (stream) {
            while (KBEngine.app.currMsgCount > 0) {
                KBEngine.app.currMsgCount--;
                var msgid = stream.readUint16();
                var msglen = stream.readInt16();
                var msgname = stream.readString();
                var argtype = stream.readInt8();
                var argsize = stream.readUint8();
                var argstypes = new Array(argsize);
                for (var i = 0; i < argsize; i++) {
                    argstypes[i] = stream.readUint8();
                }
                var handler = null;
                var isClientMethod = msgname.indexOf("Client_") >= 0;
                if (isClientMethod) {
                    handler = KBEngine.app[msgname];
                    if (handler == null || handler == undefined) {
                        KBEngine.WARNING_MSG("KBEngineApp::onImportClientMessages[" + KBEngine.app.currserver + "]: interface(" + msgname + "/" + msgid + ") no implement!");
                        handler = null;
                    }
                    else {
                        KBEngine.INFO_MSG("KBEngineApp::onImportClientMessages: import(" + msgname + ") successfully!");
                    }
                }
                if (msgname.length > 0) {
                    KBEngine.messages[msgname] = new KBEngine.Message(msgid, msgname, msglen, argtype, argstypes, handler);
                    if (isClientMethod)
                        KBEngine.clientmessages[msgid] = KBEngine.messages[msgname];
                    else
                        KBEngine.messages[KBEngine.app.currserver][msgid] = KBEngine.messages[msgname];
                }
                else {
                    KBEngine.messages[KBEngine.app.currserver][msgid] = new KBEngine.Message(msgid, msgname, msglen, argtype, argstypes, handler);
                }
            }
            ;
            KBEngine.app.onImportClientMessagesCompleted();
            KBEngine.app.currMsgID = 0;
            KBEngine.app.currMsgLen = 0;
            KBEngine.app.currMsgCount = 0;
            KBEngine.app.fragmentStream = null;
        };
        KBEngineApp.prototype.Client_onImportClientMessages = function (msg) {
            var stream = new KBEngine.MemoryStream(msg.data);
            stream.wpos = msg.data.byteLength;
            if (KBEngine.app.currMsgID == 0) {
                KBEngine.app.currMsgID = stream.readUint16();
            }
            if (KBEngine.app.currMsgID == KBEngine.messages.onImportClientMessages.id) {
                if (KBEngine.app.currMsgLen == 0) {
                    KBEngine.app.currMsgLen = stream.readUint16();
                    KBEngine.app.currMsgCount = stream.readUint16();
                }
                if (stream.length() + 2 < KBEngine.app.currMsgLen && KBEngine.app.fragmentStream == null) {
                    KBEngine.app.writeFragmentMessage(KBEngine.FragmentDataTypes.FRAGMENT_DATA_MESSAGE_BODY, stream, KBEngine.app.currMsgLen - 2);
                }
                else if (KBEngine.app.fragmentStream != null) {
                    KBEngine.app.mergeFragmentMessage(stream);
                    if (KBEngine.app.fragmentStream.length() + 2 >= KBEngine.app.currMsgLen) {
                        KBEngine.app.importClientMessages(KBEngine.app.fragmentStream);
                    }
                }
                else {
                    KBEngine.app.importClientMessages(stream);
                }
            }
            else {
                KBEngine.ERROR_MSG("KBEngineApp::onmessage: not found msg(" + KBEngine.app.currMsgID + ")!");
            }
        };
        KBEngineApp.prototype.createAccount = function (username, password, datas) {
            KBEngine.app.reset();
            KBEngine.app.username = username;
            KBEngine.app.password = password;
            KBEngine.app.clientdatas = datas;
            KBEngine.app.createAccount_loginapp(true);
        };
        KBEngineApp.prototype.createAccount_loginapp = function (noconnect) {
            if (noconnect) {
                KBEngine.INFO_MSG("KBEngineApp::createAccount_loginapp: start connect to ws://" + KBEngine.app.args.ip + ":" + KBEngine.app.args.port + "!");
                KBEngine.app.currconnect = "loginapp";
                KBEngine.app.connect(KBEngine.app.args.ip, KBEngine.app.args.port);
                KBEngine.app.socket.onopen = KBEngine.app.onOpenLoginapp_createAccount;
            }
            else {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages['Loginapp_reqCreateAccount']);
                bundle.writeString(KBEngine.app.username);
                bundle.writeString(KBEngine.app.password);
                bundle.writeBlob(KBEngine.app.clientdatas);
                bundle.send(KBEngine.app);
            }
        };
        KBEngineApp.prototype.bindAccountEmail = function (emailAddress) {
            var bundle = KBEngine.Bundle.createObject();
            bundle.newMessage(KBEngine.messages['Baseapp_reqAccountBindEmail']);
            bundle.writeInt32(KBEngine.app.entity_id);
            bundle.writeString(KBEngine.app.password);
            bundle.writeString(emailAddress);
            bundle.send(KBEngine.app);
        };
        KBEngineApp.prototype.newPassword = function (old_password, new_password) {
            var bundle = KBEngine.Bundle.createObject();
            bundle.newMessage(KBEngine.messages['Baseapp_reqAccountNewPassword']);
            bundle.writeInt32(KBEngine.app.entity_id);
            bundle.writeString(old_password);
            bundle.writeString(new_password);
            bundle.send(KBEngine.app);
        };
        KBEngineApp.prototype.logout = function () {
            var bundle = new KBEngine.Bundle();
            bundle.newMessage(KBEngine.messages['Baseapp_logoutBaseapp']);
            bundle.writeUint64(KBEngine.app.entity_uuid);
            bundle.writeInt32(KBEngine.app.entity_id);
            bundle.send(KBEngine.app);
        };
        KBEngineApp.prototype.login = function (username, password, datas) {
            KBEngine.app.reset();
            KBEngine.app.username = username;
            KBEngine.app.password = password;
            KBEngine.app.clientdatas = datas;
            KBEngine.app.login_loginapp(true);
        };
        KBEngineApp.prototype.login_loginapp = function (noconnect) {
            if (noconnect) {
                KBEngine.INFO_MSG("KBEngineApp::login_loginapp: start connect to ws://" + KBEngine.app.args.ip + ":" + KBEngine.app.args.port + "!");
                KBEngine.app.currconnect = "loginapp";
                KBEngine.app.connect(KBEngine.app.args.ip, KBEngine.app.args.port);
                KBEngine.app.socket.onopen = KBEngine.app.onOpenLoginapp_login;
            }
            else {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages['Loginapp_login']);
                bundle.writeInt8(KBEngine.app.args.clientType); // clientType
                bundle.writeBlob(KBEngine.app.clientdatas);
                bundle.writeString(KBEngine.app.username);
                bundle.writeString(KBEngine.app.password);
                bundle.send(KBEngine.app);
            }
        };
        KBEngineApp.prototype.onOpenLoginapp_resetpassword = function () {
            KBEngine.INFO_MSG("KBEngineApp::onOpenLoginapp_resetpassword: successfully!");
            KBEngine.app.currserver = "loginapp";
            KBEngine.app.currstate = "resetpassword";
            if (!KBEngine.app.loginappMessageImported) {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages.Loginapp_importClientMessages);
                bundle.send(KBEngine.app);
                KBEngine.app.socket.onmessage = KBEngine.app.Client_onImportClientMessages;
                KBEngine.INFO_MSG("KBEngineApp::onOpenLoginapp_resetpassword: start importClientMessages ...");
            }
            else {
                KBEngine.app.onImportClientMessagesCompleted();
            }
        };
        KBEngineApp.prototype.reset_password = function (username) {
            KBEngine.app.reset();
            KBEngine.app.username = username;
            KBEngine.app.resetpassword_loginapp(true);
        };
        KBEngineApp.prototype.resetpassword_loginapp = function (noconnect) {
            if (noconnect) {
                KBEngine.INFO_MSG("KBEngineApp::createAccount_loginapp: start connect to ws://" + KBEngine.app.args.ip + ":" + KBEngine.app.args.port + "!");
                KBEngine.app.currconnect = "loginapp";
                KBEngine.app.connect(KBEngine.app.args.ip, KBEngine.app.args.port);
                KBEngine.app.socket.onopen = KBEngine.app.onOpenLoginapp_resetpassword;
            }
            else {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages['Loginapp_reqAccountResetPassword']);
                bundle.writeString(KBEngine.app.username);
                bundle.send(KBEngine.app);
            }
        };
        KBEngineApp.prototype.onOpenBaseapp = function () {
            KBEngine.INFO_MSG("KBEngineApp::onOpenBaseapp: successfully!");
            KBEngine.app.currserver = "baseapp";
            if (!KBEngine.app.baseappMessageImported) {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages.Baseapp_importClientMessages);
                bundle.send(KBEngine.app);
                KBEngine.app.socket.onmessage = KBEngine.app.Client_onImportClientMessages;
                KBEngine.Event.fire("Baseapp_importClientMessages");
            }
            else {
                KBEngine.app.onImportClientMessagesCompleted();
            }
        };
        KBEngineApp.prototype.login_baseapp = function (noconnect) {
            if (noconnect) {
                KBEngine.Event.fire("onLoginBaseapp");
                KBEngine.INFO_MSG("KBEngineApp::login_baseapp: start connect to ws://" + KBEngine.app.baseappIp + ":" + KBEngine.app.baseappPort + "!");
                KBEngine.app.currconnect = "baseapp";
                KBEngine.app.connect(KBEngine.app.baseappIp, KBEngine.app.baseappPort);
                if (KBEngine.app.socket != undefined && KBEngine.app.socket != null)
                    KBEngine.app.socket.onopen = KBEngine.app.onOpenBaseapp;
            }
            else {
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages['Baseapp_loginBaseapp']);
                bundle.writeString(KBEngine.app.username);
                bundle.writeString(KBEngine.app.password);
                bundle.send(KBEngine.app);
            }
        };
        KBEngineApp.prototype.reloginBaseapp = function () {
            KBEngine.app.lastTickCBTime = KBEngine.app.lastTickTime = Date.now();
            if (KBEngine.app.socket != undefined && KBEngine.app.socket != null)
                return;
            KBEngine.app.resetSocket();
            KBEngine.Event.fire(KBEngine.EventTypes.onReloginBaseapp);
            KBEngine.INFO_MSG("KBEngineApp::reloginBaseapp: start connect to ws://" + KBEngine.app.baseappIp + ":" + KBEngine.app.baseappPort + "!");
            KBEngine.app.currconnect = "baseapp";
            KBEngine.app.connect(KBEngine.app.baseappIp, KBEngine.app.baseappPort);
            if (KBEngine.app.socket != undefined && KBEngine.app.socket != null)
                KBEngine.app.socket.onopen = KBEngine.app.onReOpenBaseapp;
        };
        KBEngineApp.prototype.onReOpenBaseapp = function () {
            KBEngine.INFO_MSG("KBEngineApp::onReOpenBaseapp: successfully!");
            KBEngine.app.currserver = "baseapp";
            var bundle = KBEngine.Bundle.createObject();
            bundle.newMessage(KBEngine.messages['Baseapp_reloginBaseapp']);
            bundle.writeString(KBEngine.app.username);
            bundle.writeString(KBEngine.app.password);
            bundle.writeUint64(KBEngine.app.entity_uuid);
            bundle.writeInt32(KBEngine.app.entity_id);
            bundle.send(KBEngine.app);
            var dateObject = new Date();
            KBEngine.app.lastTickCBTime = dateObject.getTime();
        };
        KBEngineApp.prototype.Client_onHelloCB = function (args) {
            KBEngine.app.serverVersion = args.readString();
            KBEngine.app.serverScriptVersion = args.readString();
            KBEngine.app.serverProtocolMD5 = args.readString();
            KBEngine.app.serverEntityDefMD5 = args.readString();
            var ctype = args.readInt32();
            KBEngine.INFO_MSG("KBEngineApp::Client_onHelloCB: verInfo(" + KBEngine.app.serverVersion + "), scriptVerInfo(" +
                KBEngine.app.serverScriptVersion + "), serverProtocolMD5(" + KBEngine.app.serverProtocolMD5 + "), serverEntityDefMD5(" +
                KBEngine.app.serverEntityDefMD5 + "), ctype(" + ctype + ")!");
            var dateObject = new Date();
            KBEngine.app.lastTickCBTime = dateObject.getTime();
        };
        KBEngineApp.prototype.Client_onLoginFailed = function (args) {
            var failedcode = args.readUint16();
            KBEngine.app.serverdatas = args.readBlob();
            KBEngine.ERROR_MSG("KBEngineApp::Client_onLoginFailed: failedcode(" + KBEngine.app.serverErrs[failedcode].name + "), datas(" + KBEngine.app.serverdatas.length + ")!");
            KBEngine.Event.fire("onLoginFailed", failedcode);
        };
        KBEngineApp.prototype.Client_onLoginSuccessfully = function (args) {
            var accountName = args.readString();
            KBEngine.app.username = accountName;
            KBEngine.app.baseappIp = args.readString();
            KBEngine.app.baseappPort = args.readUint16();
            KBEngine.app.baseappUdpPort = args.readUint16();
            KBEngine.app.serverdatas = args.readBlob();
            KBEngine.INFO_MSG("KBEngineApp::Client_onLoginSuccessfully: accountName(" + accountName + "), addr(" +
                KBEngine.app.baseappIp + ":" + KBEngine.app.baseappPort + "), datas(" + KBEngine.app.serverdatas.length + ")!");
            KBEngine.app.disconnect();
            KBEngine.app.login_baseapp(true);
        };
        KBEngineApp.prototype.Client_onLoginBaseappFailed = function (failedcode) {
            KBEngine.ERROR_MSG("KBEngineApp::Client_onLoginBaseappFailed: failedcode(" + KBEngine.app.serverErrs[failedcode].name + ")!");
            KBEngine.Event.fire(KBEngine.EventTypes.onLoginBaseappFailed, failedcode);
        };
        KBEngineApp.prototype.Client_onReloginBaseappFailed = function (failedcode) {
            KBEngine.ERROR_MSG("KBEngineApp::Client_onReloginBaseappFailed: failedcode(" + KBEngine.app.serverErrs[failedcode].name + ")!");
            KBEngine.Event.fire(KBEngine.EventTypes.onReloginBaseappFailed, failedcode);
        };
        KBEngineApp.prototype.Client_onReloginBaseappSuccessfully = function (stream) {
            KBEngine.app.entity_uuid = stream.readUint64();
            KBEngine.DEBUG_MSG("KBEngineApp::Client_onReloginBaseappSuccessfully: " + KBEngine.app.username);
            KBEngine.Event.fire(KBEngine.EventTypes.onReloginBaseappSuccessfully);
        };
        KBEngineApp.prototype.getentityclass = function (entityType) {
            var runclass = KBEngine['Entities'][entityType];
            if (runclass == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::getentityclass: entityType(" + entityType + ") is error!");
                return runclass;
            }
            return runclass;
        };
        KBEngineApp.prototype.Client_onCreatedProxies = function (rndUUID, eid, entityType) {
            KBEngine.INFO_MSG("KBEngineApp::Client_onCreatedProxies: eid(" + eid + "), entityType(" + entityType + ")!");
            var entity = KBEngine.app.entities[eid];
            KBEngine.app.entity_uuid = rndUUID;
            KBEngine.app.entity_id = eid;
            if (entity == undefined) {
                var runclass = KBEngine.app.getentityclass(entityType);
                if (runclass == undefined)
                    return;
                var entity_1 = new runclass();
                entity_1.id = eid;
                entity_1.className = entityType;
                entity_1.base = new KBEngine.EntityCall();
                entity_1.base.id = eid;
                entity_1.base.className = entityType;
                entity_1.base.type = KBEngine.ENTITYCALL_TYPE_BASE;
                KBEngine.app.entities[eid] = entity_1;
                var entityMessage = KBEngine.bufferedCreateEntityMessages[eid];
                if (entityMessage != undefined) {
                    KBEngine.app.Client_onUpdatePropertys(entityMessage);
                    delete KBEngine.bufferedCreateEntityMessages[eid];
                }
                entity_1.__init__();
                entity_1.attachComponents();
                entity_1.inited = true;
                if (KBEngine.app.args.isOnInitCallPropertysSetMethods)
                    entity_1.callPropertysSetMethods();
            }
            else {
                var entityMessage = KBEngine.bufferedCreateEntityMessages[eid];
                if (entityMessage != undefined) {
                    KBEngine.app.Client_onUpdatePropertys(entityMessage);
                    delete KBEngine.bufferedCreateEntityMessages[eid];
                }
            }
        };
        KBEngineApp.prototype.getViewEntityIDFromStream = function (stream) {
            var id = 0;
            if (KBEngine.app.entityIDAliasIDList.length > 255) {
                id = stream.readInt32();
            }
            else {
                var aliasID = stream.readUint8();
                // 如果为0且客户端上一步是重登陆或者重连操作并且服务端entity在断线期间一直处于在线状态
                // 则可以忽略这个错误, 因为cellapp可能一直在向baseapp发送同步消息， 当客户端重连上时未等
                // 服务端初始化步骤开始则收到同步信息, 此时这里就会出错。
                if (KBEngine.app.entityIDAliasIDList.length <= aliasID)
                    return 0;
                id = KBEngine.app.entityIDAliasIDList[aliasID];
            }
            return id;
        };
        KBEngineApp.prototype.onUpdatePropertys_ = function (eid, stream) {
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                var entityMessage = KBEngine.bufferedCreateEntityMessages[eid];
                if (entityMessage != undefined) {
                    KBEngine.ERROR_MSG("KBEngineApp::Client_onUpdEntityComponentatePropertys: entity(" + eid + ") not found!");
                    return;
                }
                var stream1 = new KBEngine.MemoryStream(stream.buffer);
                stream1.wpos = stream.wpos;
                stream1.rpos = stream.rpos - 4;
                KBEngine.bufferedCreateEntityMessages[eid] = stream1;
                return;
            }
            entity.onUpdatePropertys(stream);
        };
        KBEngineApp.prototype.Client_onUpdatePropertysOptimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            KBEngine.app.onUpdatePropertys_(eid, stream);
        };
        KBEngineApp.prototype.Client_onUpdatePropertys = function (stream) {
            var eid = stream.readInt32();
            KBEngine.app.onUpdatePropertys_(eid, stream);
        };
        KBEngineApp.prototype.onRemoteMethodCall_ = function (eid, stream) {
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onRemoteMethodCall: entity(" + eid + ") not found!");
                return;
            }
            entity.onRemoteMethodCall(stream);
        };
        KBEngineApp.prototype.Client_onRemoteMethodCallOptimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            KBEngine.app.onRemoteMethodCall_(eid, stream);
        };
        KBEngineApp.prototype.Client_onRemoteMethodCall = function (stream) {
            var eid = stream.readInt32();
            KBEngine.app.onRemoteMethodCall_(eid, stream);
        };
        KBEngineApp.prototype.Client_onEntityEnterWorld = function (stream) {
            var eid = stream.readInt32();
            if (KBEngine.app.entity_id > 0 && eid != KBEngine.app.entity_id)
                KBEngine.app.entityIDAliasIDList.push(eid);
            var entityType;
            if (KBEngine.moduledefs['Length'] > 255)
                entityType = stream.readUint16();
            else
                entityType = stream.readUint8();
            var isOnGround = true;
            if (stream.length() > 0)
                isOnGround = stream.readInt8();
            entityType = KBEngine.moduledefs[entityType].name;
            KBEngine.INFO_MSG("KBEngineApp::Client_onEntityEnterWorld: " + entityType + "(" + eid + "), spaceID(" + KBEngine.app.spaceID + "), isOnGround(" + isOnGround + ")!");
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                var entityMessage = KBEngine.bufferedCreateEntityMessages[eid];
                if (entityMessage == undefined) {
                    KBEngine.ERROR_MSG("KBEngineApp::Client_onEntityEnterWorld: entity(" + eid + ") not found!");
                    return;
                }
                var runclass = KBEngine.app.getentityclass(entityType);
                if (runclass == undefined)
                    return;
                var entity_2 = new runclass();
                entity_2.id = eid;
                entity_2.className = entityType;
                entity_2.cell = new KBEngine.EntityCall();
                entity_2.cell.id = eid;
                entity_2.cell.className = entityType;
                entity_2.cell.type = KBEngine.ENTITYCALL_TYPE_CELL;
                KBEngine.app.entities[eid] = entity_2;
                KBEngine.app.Client_onUpdatePropertys(entityMessage);
                delete KBEngine.bufferedCreateEntityMessages[eid];
                // entity.isOnGround = isOnGround > 0;
                entity_2.isOnGround = isOnGround;
                entity_2.__init__();
                entity_2.attachComponents();
                entity_2.inited = true;
                entity_2.inWorld = true;
                entity_2.enterWorld();
                if (KBEngine.app.args.isOnInitCallPropertysSetMethods)
                    entity_2.callPropertysSetMethods();
                entity_2.set_direction(entity_2.direction);
                entity_2.set_position(entity_2.position);
            }
            else {
                if (!entity.inWorld) {
                    entity.cell = new KBEngine.EntityCall();
                    entity.cell.id = eid;
                    entity.cell.className = entityType;
                    entity.cell.type = KBEngine.ENTITYCALL_TYPE_CELL;
                    // 安全起见， 这里清空一下
                    // 如果服务端上使用giveClientTo切换控制权
                    // 之前的实体已经进入世界， 切换后的实体也进入世界， 这里可能会残留之前那个实体进入世界的信息
                    KBEngine.app.entityIDAliasIDList = [];
                    KBEngine.app.entities = {};
                    KBEngine.app.entities[entity.id] = entity;
                    entity.set_direction(entity.direction);
                    entity.set_position(entity.position);
                    KBEngine.app.entityServerPos.x = entity.position.x;
                    KBEngine.app.entityServerPos.y = entity.position.y;
                    KBEngine.app.entityServerPos.z = entity.position.z;
                    entity.isOnGround = isOnGround;
                    // entity.isOnGround = isOnGround > 0;
                    entity.inWorld = true;
                    entity.enterWorld();
                    if (KBEngine.app.args.isOnInitCallPropertysSetMethods)
                        entity.callPropertysSetMethods();
                }
            }
        };
        KBEngineApp.prototype.Client_onEntityLeaveWorldOptimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            KBEngine.app.Client_onEntityLeaveWorld(eid);
        };
        KBEngineApp.prototype.Client_onEntityLeaveWorld = function (eid) {
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onEntityLeaveWorld: entity(" + eid + ") not found!");
                return;
            }
            if (entity.inWorld)
                entity.leaveWorld();
            if (KBEngine.app.entity_id > 0 && eid != KBEngine.app.entity_id) {
                var newArray0 = [];
                for (var i = 0; i < KBEngine.app.controlledEntities.length; i++) {
                    if (KBEngine.app.controlledEntities[i] != eid) {
                        newArray0.push(KBEngine.app.controlledEntities[i]);
                    }
                    else {
                        KBEngine.Event.fire("onLoseControlledEntity");
                    }
                }
                KBEngine.app.controlledEntities = newArray0;
                delete KBEngine.app.entities[eid];
                var newArray = [];
                for (var i = 0; i < KBEngine.app.entityIDAliasIDList.length; i++) {
                    if (KBEngine.app.entityIDAliasIDList[i] != eid) {
                        newArray.push(KBEngine.app.entityIDAliasIDList[i]);
                    }
                }
                KBEngine.app.entityIDAliasIDList = newArray;
            }
            else {
                KBEngine.app.clearSpace(false);
                entity.cell = null;
            }
        };
        KBEngineApp.prototype.Client_onEntityDestroyed = function (eid) {
            KBEngine.INFO_MSG("KBEngineApp::Client_onEntityDestroyed: entity(" + eid + ")!");
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onEntityDestroyed: entity(" + eid + ") not found!");
                return;
            }
            if (entity.inWorld) {
                if (KBEngine.app.entity_id == eid)
                    KBEngine.app.clearSpace(false);
                entity.leaveWorld();
            }
            delete KBEngine.app.entities[eid];
        };
        KBEngineApp.prototype.Client_onEntityEnterSpace = function (stream) {
            var eid = stream.readInt32();
            KBEngine.app.spaceID = stream.readUint32();
            var isOnGround = true;
            if (stream.length() > 0)
                isOnGround = stream.readInt8();
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onEntityEnterSpace: entity(" + eid + ") not found!");
                return;
            }
            entity.isOnGround = isOnGround;
            KBEngine.app.entityServerPos.x = entity.position.x;
            KBEngine.app.entityServerPos.y = entity.position.y;
            KBEngine.app.entityServerPos.z = entity.position.z;
            entity.enterSpace();
        };
        KBEngineApp.prototype.Client_onEntityLeaveSpace = function (eid) {
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onEntityLeaveSpace: entity(" + eid + ") not found!");
                return;
            }
            KBEngine.app.clearSpace(false);
            entity.leaveSpace();
        };
        KBEngineApp.prototype.Client_onKicked = function (failedcode) {
            KBEngine.ERROR_MSG("KBEngineApp::Client_onKicked: failedcode(" + KBEngine.app.serverErrs[failedcode].name + ")!");
            KBEngine.Event.fire(KBEngine.EventTypes.onKicked, failedcode);
        };
        KBEngineApp.prototype.Client_onCreateAccountResult = function (stream) {
            var retcode = stream.readUint16();
            var datas = stream.readBlob();
            KBEngine.Event.fire("onCreateAccountResult", retcode, datas);
            if (retcode != 0) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onCreateAccountResult: " + KBEngine.app.username + " create is failed! code=" + KBEngine.app.serverErrs[retcode].name + "!");
                return;
            }
            KBEngine.INFO_MSG("KBEngineApp::Client_onCreateAccountResult: " + KBEngine.app.username + " create is successfully!");
        };
        KBEngineApp.prototype.Client_onControlEntity = function (eid, isControlled) {
            // eid = stream.readInt32();
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onControlEntity: entity(" + eid + ") not found!");
                return;
            }
            var isCont = isControlled != 0;
            if (isCont) {
                // 如果被控制者是玩家自己，那表示玩家自己被其它人控制了
                // 所以玩家自己不应该进入这个被控制列表
                if (KBEngine.app.player().id != entity.id) {
                    KBEngine.app.controlledEntities.push(entity);
                }
            }
            else {
                var newArray = [];
                for (var i = 0; i < KBEngine.app.controlledEntities.length; i++)
                    if (KBEngine.app.controlledEntities[i] != entity.id)
                        newArray.push(KBEngine.app.controlledEntities[i]);
                KBEngine.app.controlledEntities = newArray;
            }
            entity.isControlled = isCont;
            try {
                entity.onControlled(isCont);
                KBEngine.Event.fire(KBEngine.EventTypes.onControlled, entity, isCont);
            }
            catch (e) {
                KBEngine.ERROR_MSG("KBEngine::Client_onControlEntity: entity id = '" + eid + "', is controlled = '" + isCont + "', error = '" + e + "'");
            }
        };
        KBEngineApp.prototype.updatePlayerToServer = function () {
            var player = KBEngine.app.player();
            if (player == undefined || player.inWorld == false || KBEngine.app.spaceID == 0 || player.isControlled)
                return;
            if (player.entityLastLocalPos.distance(player.position) > 0.001 || player.entityLastLocalDir.distance(player.direction) > 0.001) {
                // 记录玩家最后一次上报位置时自身当前的位置
                player.entityLastLocalPos.x = player.position.x;
                player.entityLastLocalPos.y = player.position.y;
                player.entityLastLocalPos.z = player.position.z;
                player.entityLastLocalDir.x = player.direction.x;
                player.entityLastLocalDir.y = player.direction.y;
                player.entityLastLocalDir.z = player.direction.z;
                var bundle = KBEngine.Bundle.createObject();
                bundle.newMessage(KBEngine.messages['Baseapp_onUpdateDataFromClient']);
                bundle.writeFloat(player.position.x);
                bundle.writeFloat(player.position.y);
                bundle.writeFloat(player.position.z);
                bundle.writeFloat(player.direction.x);
                bundle.writeFloat(player.direction.y);
                bundle.writeFloat(player.direction.z);
                bundle.writeUint8(player.isOnGround);
                bundle.writeUint32(KBEngine.app.spaceID);
                bundle.send(KBEngine.app);
            }
            // 开始同步所有被控制了的entity的位置
            for (var i in KBEngine.app.controlledEntities) {
                var entity = KBEngine.app.controlledEntities[i];
                var position = entity.position;
                var direction = entity.direction;
                var posHasChanged = entity.entityLastLocalPos.distance(position) > 0.001;
                var dirHasChanged = entity.entityLastLocalDir.distance(direction) > 0.001;
                if (posHasChanged || dirHasChanged) {
                    entity.entityLastLocalPos = position;
                    entity.entityLastLocalDir = direction;
                    var bundle = KBEngine.Bundle.createObject();
                    bundle.newMessage(KBEngine.messages['Baseapp_onUpdateDataFromClientForControlledEntity']);
                    bundle.writeInt32(entity.id);
                    bundle.writeFloat(position.x);
                    bundle.writeFloat(position.y);
                    bundle.writeFloat(position.z);
                    bundle.writeFloat(direction.x);
                    bundle.writeFloat(direction.y);
                    bundle.writeFloat(direction.z);
                    bundle.writeUint8(entity.isOnGround);
                    bundle.writeUint32(KBEngine.app.spaceID);
                    bundle.send(KBEngine.app);
                }
            }
        };
        KBEngineApp.prototype.addSpaceGeometryMapping = function (spaceID, respath) {
            KBEngine.INFO_MSG("KBEngineApp::addSpaceGeometryMapping: spaceID(" + spaceID + "), respath(" + respath + ")!");
            KBEngine.app.spaceID = spaceID;
            KBEngine.app.spaceResPath = respath;
            KBEngine.Event.fire(KBEngine.EventTypes.addSpaceGeometryMapping, respath);
        };
        KBEngineApp.prototype.clearSpace = function (isAll) {
            KBEngine.app.entityIDAliasIDList = [];
            KBEngine.app.spacedata = {};
            KBEngine.app.clearEntities(isAll);
            KBEngine.app.isLoadedGeometry = false;
            KBEngine.app.spaceID = 0;
        };
        KBEngineApp.prototype.clearEntities = function (isAll) {
            KBEngine.app.controlledEntities = [];
            if (!isAll) {
                var entity = KBEngine.app.player();
                for (var eid in KBEngine.app.entities) {
                    if (eid == entity.id)
                        continue;
                    if (KBEngine.app.entities[eid].inWorld) {
                        KBEngine.app.entities[eid].leaveWorld();
                    }
                    KBEngine.app.entities[eid].onDestroy();
                }
                KBEngine.app.entities = {};
                KBEngine.app.entities[entity.id] = entity;
            }
            else {
                for (var eid in KBEngine.app.entities) {
                    if (KBEngine.app.entities[eid].inWorld) {
                        KBEngine.app.entities[eid].leaveWorld();
                    }
                    KBEngine.app.entities[eid].onDestroy();
                }
                KBEngine.app.entities = {};
            }
        };
        KBEngineApp.prototype.Client_initSpaceData = function (stream) {
            KBEngine.app.clearSpace(false);
            KBEngine.app.spaceID = stream.readInt32();
            while (stream.length() > 0) {
                var key = stream.readString();
                var value = stream.readString();
                KBEngine.app.Client_setSpaceData(KBEngine.app.spaceID, key, value);
            }
            KBEngine.INFO_MSG("KBEngineApp::Client_initSpaceData: spaceID(" + KBEngine.app.spaceID + "), datas(" + KBEngine.app.spacedata + ")!");
        };
        KBEngineApp.prototype.Client_setSpaceData = function (spaceID, key, value) {
            KBEngine.INFO_MSG("KBEngineApp::Client_setSpaceData: spaceID(" + spaceID + "), key(" + key + "), value(" + value + ")!");
            KBEngine.app.spacedata[key] = value;
            if (key == "_mapping")
                KBEngine.app.addSpaceGeometryMapping(spaceID, value);
            KBEngine.Event.fire("onSetSpaceData", spaceID, key, value);
        };
        KBEngineApp.prototype.Client_delSpaceData = function (spaceID, key) {
            KBEngine.INFO_MSG("KBEngineApp::Client_delSpaceData: spaceID(" + spaceID + "), key(" + key + ")!");
            delete KBEngine.app.spacedata[key];
            KBEngine.Event.fire("onDelSpaceData", spaceID, key);
        };
        KBEngineApp.prototype.Client_getSpaceData = function (spaceID, key) {
            return KBEngine.app.spacedata[key];
        };
        KBEngineApp.prototype.Client_onUpdateBasePos = function (x, y, z) {
            KBEngine.app.entityServerPos.x = x;
            KBEngine.app.entityServerPos.y = y;
            KBEngine.app.entityServerPos.z = z;
        };
        KBEngineApp.prototype.Client_onUpdateBasePosXZ = function (x, z) {
            KBEngine.app.entityServerPos.x = x;
            KBEngine.app.entityServerPos.z = z;
        };
        KBEngineApp.prototype.Client_onUpdateData = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onUpdateData: entity(" + eid + ") not found!");
                return;
            }
        };
        KBEngineApp.prototype.Client_onSetEntityPosAndDir = function (stream) {
            var eid = stream.readInt32();
            var entity = KBEngine.app.entities[eid];
            if (entity == undefined) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onSetEntityPosAndDir: entity(" + eid + ") not found!");
                return;
            }
            entity.position.x = stream.readFloat();
            entity.position.y = stream.readFloat();
            entity.position.z = stream.readFloat();
            entity.direction.x = stream.readFloat();
            entity.direction.y = stream.readFloat();
            entity.direction.z = stream.readFloat();
            // 记录玩家最后一次上报位置时自身当前的位置
            entity.entityLastLocalPos.x = entity.position.x;
            entity.entityLastLocalPos.y = entity.position.y;
            entity.entityLastLocalPos.z = entity.position.z;
            entity.entityLastLocalDir.x = entity.direction.x;
            entity.entityLastLocalDir.y = entity.direction.y;
            entity.entityLastLocalDir.z = entity.direction.z;
            entity.set_direction(entity.direction);
            entity.set_position(entity.position);
        };
        KBEngineApp.prototype.Client_onUpdateData_ypr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readFloat();
            var p = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, p, r, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_yp = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readFloat();
            var p = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, p, KBEngine.KBE_FLT_MAX, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_yr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, KBEngine.KBE_FLT_MAX, r, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_pr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var p = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, p, r, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_y = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_p = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var p = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, p, KBEngine.KBE_FLT_MAX, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_r = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, r, -1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            // let x = stream.readFloat(); 		let z = stream.readFloat();
            var x = stream.readFloat();
            var z = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_ypr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var p = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, y, p, r, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_yp = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var p = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, y, p, KBEngine.KBE_FLT_MAX, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_yr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, y, KBEngine.KBE_FLT_MAX, r, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_pr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var p = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, KBEngine.KBE_FLT_MAX, p, r, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_y = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, y, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_p = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, KBEngine.KBE_FLT_MAX, p, KBEngine.KBE_FLT_MAX, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_r = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, x, KBEngine.KBE_FLT_MAX, z, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, r, 1);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var y = stream.readFloat();
            var z = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_ypr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var y = stream.readFloat();
            var z = stream.readFloat();
            var yaw = stream.readFloat();
            var p = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, yaw, p, r, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_yp = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var yaw = stream.readFloat();
            var p = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, yaw, p, KBEngine.KBE_FLT_MAX, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_yr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var yaw = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, yaw, KBEngine.KBE_FLT_MAX, r, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_pr = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var p = stream.readFloat();
            var r = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, KBEngine.KBE_FLT_MAX, p, r, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_y = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var yaw = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, yaw, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_p = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            var p = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, KBEngine.KBE_FLT_MAX, p, KBEngine.KBE_FLT_MAX, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_r = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var x = stream.readFloat();
            var z = stream.readFloat();
            var y = stream.readFloat();
            //todo 这个是自己加的，如果错误再修改
            var r = stream.readFloat();
            // let p = stream.readFloat();
            KBEngine.app._updateVolatileData(eid, x, y, z, r, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 0);
        };
        KBEngineApp.prototype.Client_onUpdateData_ypr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readInt8();
            var p = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, p, r, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_yp_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readInt8();
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, p, KBEngine.KBE_FLT_MAX, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_yr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, KBEngine.KBE_FLT_MAX, r, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_pr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var p = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, p, r, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_y_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var y = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, y, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_p_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, p, KBEngine.KBE_FLT_MAX, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_r_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, r, -1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_ypr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readInt8();
            var p = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], y, p, r, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_yp_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readInt8();
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], y, p, KBEngine.KBE_FLT_MAX, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_yr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], y, KBEngine.KBE_FLT_MAX, r, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_pr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var p = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], KBEngine.KBE_FLT_MAX, p, r, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_y_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], y, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_p_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], KBEngine.KBE_FLT_MAX, p, KBEngine.KBE_FLT_MAX, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xz_r_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], KBEngine.KBE_FLT_MAX, xz[1], KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, r, 1, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_ypr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var yaw = stream.readInt8();
            var p = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], yaw, p, r, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_yp_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var yaw = stream.readInt8();
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], yaw, p, KBEngine.KBE_FLT_MAX, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_yr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var yaw = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], yaw, KBEngine.KBE_FLT_MAX, r, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_pr_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var p = stream.readInt8();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], KBEngine.KBE_FLT_MAX, p, r, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_y_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var yaw = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], yaw, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_p_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var p = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], KBEngine.KBE_FLT_MAX, p, KBEngine.KBE_FLT_MAX, 0, true);
        };
        KBEngineApp.prototype.Client_onUpdateData_xyz_r_optimized = function (stream) {
            var eid = KBEngine.app.getViewEntityIDFromStream(stream);
            var xz = stream.readPackXZ();
            var y = stream.readPackY();
            var r = stream.readInt8();
            KBEngine.app._updateVolatileData(eid, xz[0], y, xz[1], r, KBEngine.KBE_FLT_MAX, KBEngine.KBE_FLT_MAX, 0, true);
        };
        KBEngineApp.prototype._updateVolatileData = function (entityID, x, y, z, yaw, pitch, roll, isOnGround, isOptimized) {
            if (isOptimized === void 0) { isOptimized = false; }
            var entity = KBEngine.app.entities[entityID];
            if (entity == undefined) {
                // 如果为0且客户端上一步是重登陆或者重连操作并且服务端entity在断线期间一直处于在线状态
                // 则可以忽略这个错误, 因为cellapp可能一直在向baseapp发送同步消息， 当客户端重连上时未等
                // 服务端初始化步骤开始则收到同步信息, 此时这里就会出错。			
                KBEngine.ERROR_MSG("KBEngineApp::_updateVolatileData: entity(" + entityID + ") not found!");
                return;
            }
            // 小于0不设置
            if (isOnGround >= 0) {
                entity.isOnGround = (isOnGround > 0);
            }
            var changeDirection = false;
            if (roll != KBEngine.KBE_FLT_MAX) {
                changeDirection = true;
                entity.direction.x = KBEngine.int82angle(roll, false);
            }
            if (pitch != KBEngine.KBE_FLT_MAX) {
                changeDirection = true;
                entity.direction.y = KBEngine.int82angle(pitch, false);
            }
            if (yaw != KBEngine.KBE_FLT_MAX) {
                changeDirection = true;
                entity.direction.z = KBEngine.int82angle(yaw, false);
            }
            var done = false;
            if (changeDirection == true) {
                KBEngine.Event.fire("set_direction", entity);
                done = true;
            }
            var positionChanged = false;
            if (x != KBEngine.KBE_FLT_MAX || y != KBEngine.KBE_FLT_MAX || z != KBEngine.KBE_FLT_MAX)
                positionChanged = true;
            if (x == KBEngine.KBE_FLT_MAX)
                x = 0.0;
            if (y == KBEngine.KBE_FLT_MAX)
                y = 0.0;
            if (z == KBEngine.KBE_FLT_MAX)
                z = 0.0;
            if (positionChanged) {
                if (isOptimized) {
                    entity.position.x = x + KBEngine.app.entityServerPos.x;
                    entity.position.y = y + KBEngine.app.entityServerPos.y;
                    entity.position.z = z + KBEngine.app.entityServerPos.z;
                }
                else {
                    entity.position.x = x;
                    entity.position.y = y;
                    entity.position.z = z;
                }
                done = true;
                KBEngine.Event.fire("updatePosition", entity);
            }
            if (done)
                entity.onUpdateVolatileData();
        };
        KBEngineApp.prototype.Client_onStreamDataStarted = function (id, datasize, descr) {
            KBEngine.Event.fire(KBEngine.EventTypes.onStreamDataStarted, id, datasize, descr);
        };
        KBEngineApp.prototype.Client_onStreamDataRecv = function (stream) {
            var id = stream.readUint16();
            var data = stream.readBlob();
            KBEngine.Event.fire(KBEngine.EventTypes.onStreamDataRecv, id, data);
        };
        KBEngineApp.prototype.Client_onStreamDataCompleted = function (id) {
            KBEngine.Event.fire(KBEngine.EventTypes.onStreamDataCompleted, id);
        };
        KBEngineApp.prototype.Client_onReqAccountResetPasswordCB = function (failedcode) {
            if (failedcode != 0) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onReqAccountResetPasswordCB: " + KBEngine.app.username + " is failed! code=" + KBEngine.app.serverErrs[failedcode].name + "!");
                return;
            }
            KBEngine.INFO_MSG("KBEngineApp::Client_onReqAccountResetPasswordCB: " + KBEngine.app.username + " is successfully!");
        };
        KBEngineApp.prototype.Client_onReqAccountBindEmailCB = function (failedcode) {
            if (failedcode != 0) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onReqAccountBindEmailCB: " + KBEngine.app.username + " is failed! code=" + KBEngine.app.serverErrs[failedcode].name + "!");
                return;
            }
            KBEngine.INFO_MSG("KBEngineApp::Client_onReqAccountBindEmailCB: " + KBEngine.app.username + " is successfully!");
        };
        KBEngineApp.prototype.Client_onReqAccountNewPasswordCB = function (failedcode) {
            if (failedcode != 0) {
                KBEngine.ERROR_MSG("KBEngineApp::Client_onReqAccountNewPasswordCB: " + KBEngine.app.username + " is failed! code=" + KBEngine.app.serverErrs[failedcode].name + "!");
                return;
            }
            KBEngine.INFO_MSG("KBEngineApp::Client_onReqAccountNewPasswordCB: " + KBEngine.app.username + " is successfully!");
        };
        return KBEngineApp;
    }());
    KBEngine.KBEngineApp = KBEngineApp;
    __reflect(KBEngineApp.prototype, "KBEngine.KBEngineApp");
    // 描述服务端返回的错误信息
    var ServerErr = (function () {
        function ServerErr() {
            this.name = "";
            this.descr = "";
            this.id = 0;
        }
        return ServerErr;
    }());
    KBEngine.ServerErr = ServerErr;
    __reflect(ServerErr.prototype, "KBEngine.ServerErr");
    KBEngine.FragmentDataTypes = {
        FRAGMENT_DATA_UNKNOW: 0,
        FRAGMENT_DATA_MESSAGE_ID: 1,
        FRAGMENT_DATA_MESSAGE_LENGTH: 2,
        FRAGMENT_DATA_MESSAGE_LENGTH1: 3,
        FRAGMENT_DATA_MESSAGE_BODY: 4
    };
    var idInterval;
    function create(args) {
        if (KBEngine.app != undefined)
            return;
        new KBEngineApp(args);
        KBEngine.app.reset();
        KBEngine.app.installEvents();
        idInterval = setInterval(KBEngine.app.update, args.updateHZ);
    }
    KBEngine.create = create;
    function destroy() {
        if (idInterval != undefined)
            clearInterval(idInterval);
        if (KBEngine.app == undefined)
            return;
        KBEngine.app.uninstallEvents();
        KBEngine.app.reset();
        KBEngine.app = undefined;
        KBEngine.Event.clear();
    }
    KBEngine.destroy = destroy;
})(KBEngine || (KBEngine = {}));
