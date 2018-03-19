/**
 * KBEngine的html5客户端扩展ts版
 */
declare namespace KBEngine {
    class Class {
    }
    const PACKET_MAX_SIZE = 1500;
    const PACKET_MAX_SIZE_TCP = 1460;
    const PACKET_MAX_SIZE_UDP = 1472;
    const MESSAGE_ID_LENGTH = 2;
    const MESSAGE_LENGTH_LENGTH = 2;
    const CLIENT_NO_FLOAT = 0;
    const KBE_FLT_MAX = 3.402823466e+38;
    class INT64 {
        constructor(lo: any, hi: any);
        lo: number;
        hi: number;
        sign: number;
        toString(): string;
    }
    class UINT64 {
        constructor(lo: any, hi: any);
        lo: number;
        hi: number;
        toString(): string;
    }
    function INFO_MSG(s: any): void;
    function DEBUG_MSG(s: any): void;
    function ERROR_MSG(s: any): void;
    function WARNING_MSG(s: any): void;
    function utf8ArrayToString(array: Array<any>): any;
    function stringToUTF8Bytes(str: string): any[];
    class EventInfo {
        constructor(classinst: any, callbackfn: any);
        classinst: any;
        callbackfn: any;
    }
    interface IEvents {
        [evtName: string]: EventInfo[];
    }
    class Events {
        constructor();
        _events: IEvents;
        register(evtName: string, classinst: any, strCallback: string): void;
        deregister(evtName: any, classinst: any): void;
        fire(evtName: any, ...args: any[]): void;
    }
    const Event: Events;
    class MemoryStream {
        constructor(size_or_buffer: any);
        buffer: ArrayBuffer;
        rpos: number;
        wpos: number;
        readInt8(): number;
        readInt16(): number;
        readInt32(): number;
        readInt64(): INT64;
        readUint8(): number;
        readUint16(): number;
        readUint32(): number;
        readUint64(): UINT64;
        readFloat(): any;
        readDouble(): any;
        readString(): string;
        readBlob(): Uint8Array;
        readStream(): MemoryStream;
        readPackXZ(): any[];
        readPackY(): number;
        writeInt8(v: any): void;
        writeInt16(v: any): void;
        writeInt32(v: any): void;
        writeInt64(v: any): void;
        writeUint8(v: any): void;
        writeUint16(v: any): void;
        writeUint32(v: any): void;
        writeUint64(v: any): void;
        writeFloat(v: any): void;
        writeDouble(v: any): void;
        writeBlob(v: any): void;
        writeString(v: any): void;
        readSkip(v: any): void;
        space(): number;
        length(): number;
        readEOF(): boolean;
        done(): void;
        getbuffer(v: any): ArrayBuffer;
    }
    module MemoryStream {
        class PackFloatXType {
            _unionData: ArrayBuffer;
            fv: Float32Array;
            uv: Uint32Array;
            iv: Int32Array;
            constructor();
        }
    }
    class Bundle {
        constructor();
        memorystreams: Array<any>;
        stream: MemoryStream;
        numMessage: number;
        messageLengthBuffer: any;
        msgtype: any;
        messageLength: number;
        newMessage(msgtype: any): void;
        writeMsgLength(v: any): void;
        fini(issend: any): void;
        send(network: any): void;
        checkStream(v: any): void;
        writeInt8(v: any): void;
        writeInt16(v: any): void;
        writeInt32(v: any): void;
        writeInt64(v: any): void;
        writeUint8(v: any): void;
        writeUint16(v: any): void;
        writeUint32(v: any): void;
        writeUint64(v: any): void;
        writeFloat(v: any): void;
        writeDouble(v: any): void;
        writeString(v: any): void;
        writeBlob(v: any): void;
    }
    const reader: MemoryStream;
    interface IDataType2Id {
        [type: string]: number;
    }
    let datatype2id: IDataType2Id;
    function mappingDataType(): void;
    function bindWriter(writer: any, argType: number): any;
    function bindReader(argType: number): () => any;
    class Message {
        constructor(id: any, name: any, length: any, argstype: any, args: any, handler: any);
        id: any;
        name: any;
        length: any;
        argsType: any;
        args: any;
        handler: any;
        createFromStream(msgstream: any): any;
        handleMessage(msgstream: any): void;
    }
    module messages {
        const loginapp: {};
        const baseapp: {};
        const Loginapp_importClientMessages: Message;
        const Baseapp_importClientMessages: Message;
        const Baseapp_importClientEntityDef: Message;
        const onImportClientMessages: Message;
    }
    let clientmessages: {};
    let bufferedCreateEntityMessage: {};
    class Vector3 extends Class {
        constructor(x: any, y: any, z: any);
        x: number;
        y: number;
        z: number;
        distance(pos: Vector3): number;
    }
    function clampf(value: any, min_inclusive: any, max_inclusive: any): any;
    function int82angle(angle: any, half: any): number;
    function angle2int8(v: number, half: boolean): number;
    class Entity extends Class {
        constructor();
        id: number;
        className: string;
        position: Vector3;
        direction: Vector3;
        velocity: number;
        cell: any;
        base: any;
        inWorld: boolean;
        inited: boolean;
        isControlled: boolean;
        entityLastLocalPos: Vector3;
        entityLastLocalDir: Vector3;
        isOnGround: boolean;
        __init__(): void;
        callPropertysSetMethods(): void;
        onDestroy(): void;
        onControlled(bIsControlled: any): void;
        isPlayer(): boolean;
        baseCall(...params: any[]): void;
        cellCall(...params: any[]): void;
        enterWorld(): void;
        onEnterWorld(): void;
        leaveWorld(): void;
        onLeaveWorld(): void;
        enterSpace(): void;
        onEnterSpace(): void;
        leaveSpace(): void;
        onLeaveSpace(): void;
        set_position(): void;
        onUpdateVolatileData(): void;
        set_direction(old: any): void;
    }
    const ENTITYCALL_TYPE_CELL = 0;
    const ENTITYCALL_TYPE_BASE = 1;
    class EntityCall {
        constructor();
        id: number;
        className: string;
        type: number;
        networkInterface: KBEngineApp;
        bundle: any;
        isBase(): boolean;
        isCell(): boolean;
        newCall(): any;
        sendCall(bundle: any): void;
    }
    const moduledefs: {};
    class DATATYPE_UINT8 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_UINT16 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_UINT32 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_UINT64 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_INT8 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_INT16 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_INT32 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_INT64 {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_FLOAT {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_DOUBLE extends DATATYPE_FLOAT {
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
    }
    class DATATYPE_STRING {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_VECTOR2 {
        bind(): void;
        createFromStream(stream: any): Vector3;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_VECTOR3 {
        bind(): void;
        createFromStream(stream: any): Vector3;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_VECTOR4 {
        bind(): void;
        createFromStream(stream: any): Vector3;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_PYTHON {
        bind(): void;
        createFromStream(stream: any): void;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_UNICODE {
        bind(): void;
        createFromStream(stream: any): any;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): string;
        isSameType(v: any): boolean;
    }
    class DATATYPE_ENTITYCALL {
        bind(): void;
        createFromStream(stream: any): void;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_BLOB {
        bind(): void;
        createFromStream(stream: any): Uint8Array;
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_ARRAY {
        type: any;
        bind(): void;
        createFromStream(stream: any): any[];
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    class DATATYPE_FIXED_DICT {
        dicttype: {};
        implementedBy: any;
        bind(): void;
        createFromStream(stream: any): {};
        addToStream(stream: any, v: any): void;
        parseDefaultValStr(v: any): any;
        isSameType(v: any): boolean;
    }
    module datatypes {
        const UINT8: DATATYPE_UINT8;
        const UINT16: DATATYPE_UINT16;
        const UINT32: DATATYPE_UINT32;
        const UINT64: DATATYPE_UINT64;
        const INT8: DATATYPE_INT8;
        const INT16: DATATYPE_INT16;
        const INT32: DATATYPE_INT32;
        const INT64: DATATYPE_INT64;
        const FLOAT: DATATYPE_FLOAT;
        const DOUBLE: DATATYPE_DOUBLE;
        const STRING: DATATYPE_STRING;
        const VECTOR2: DATATYPE_VECTOR2;
        const VECTOR3: DATATYPE_VECTOR3;
        const VECTOR4: DATATYPE_VECTOR4;
        const PYTHON: DATATYPE_PYTHON;
        const UNICODE: DATATYPE_UNICODE;
        const ENTITYCALL: DATATYPE_ENTITYCALL;
        const BLOB: DATATYPE_BLOB;
    }
    class KBEngineArgs {
        ip: string;
        port: number;
        updateHZ: number;
        serverHeartbeatTick: number;
        clientType: number;
        isOnInitCallPropertysSetMethods: boolean;
    }
    class KBEngineApp {
        constructor(args: KBEngineArgs);
        args: KBEngineArgs;
        baseappIp: string;
        username: string;
        password: string;
        clientdatas: string;
        encryptedKey: string;
        loginappMessageImported: boolean;
        baseappMessageImported: boolean;
        serverErrorsDescrImported: boolean;
        entitydefImported: boolean;
        serverErrs: {
            [err: string]: ServerErr;
        };
        ip: string;
        port: number;
        baseappIP: string;
        baseappPort: number;
        socket: any;
        currserver: string;
        currstate: string;
        serverdatas: string;
        serverVersion: string;
        serverScriptVersion: string;
        serverProtocolMD5: string;
        serverEntityDefMD5: string;
        clientVersion: string;
        clientScriptVersion: string;
        entity_uuid: any;
        entity_id: number;
        entity_type: string;
        entityServerPos: Vector3;
        entities: {};
        entityIDAliasIDList: any[];
        controlledEntities: any[];
        spacedata: {};
        spaceID: number;
        spaceResPath: string;
        isLoadedGeometry: boolean;
        lastTickTime: number;
        lastTickCBTime: number;
        component: any;
        resetSocket(): void;
        reset(): void;
        installEvents(): void;
        uninstallEvents(): void;
        hello(): void;
        player(): any;
        findEntity(entityID: any): any;
        connect(addr: any): void;
        disconnect(): void;
        onopen(): void;
        onerror_before_onopen(evt: any): void;
        onerror_after_onopen(evt: any): void;
        onmessage(msg: any): void;
        onclose(): void;
        send(msg: any): void;
        close(): void;
        update(): void;
        Client_onAppActiveTickCB(): void;
        serverErr(id: any): string;
        Client_onImportServerErrorsDescr(stream: any): void;
        onOpenLoginapp_login(): void;
        onOpenLoginapp_createAccount(): void;
        onImportClientMessagesCompleted(): void;
        createDataTypeFromStreams(stream: any, canprint: any): void;
        createDataTypeFromStream(stream: any, canprint: any): void;
        Client_onImportClientEntityDef(stream: any): void;
        Client_onVersionNotMatch(stream: any): void;
        Client_onScriptVersionNotMatch(stream: any): void;
        onImportEntityDefCompleted(): void;
        Client_onImportClientMessages(msg: any): void;
        createAccount(username: any, password: any, datas: any): void;
        createAccount_loginapp(noconnect: any): void;
        bindAccountEmail(emailAddress: any): void;
        newPassword(old_password: any, new_password: any): void;
        login(username: any, password: any, datas: any): void;
        login_loginapp(noconnect: any): void;
        onOpenLoginapp_resetpassword(): void;
        reset_password(username: any): void;
        resetpassword_loginapp(noconnect: any): void;
        onOpenBaseapp(): void;
        login_baseapp(noconnect: any): void;
        reloginBaseapp(): void;
        onReOpenBaseapp(): void;
        Client_onHelloCB(args: any): void;
        Client_onLoginFailed(args: any): void;
        Client_onLoginSuccessfully(args: any): void;
        Client_onLoginBaseappFailed(failedcode: any): void;
        Client_onReloginBaseappFailed(failedcode: any): void;
        Client_onReloginBaseappSuccessfully(stream: any): void;
        entityclass: {};
        getentityclass(entityType: any): any;
        Client_onCreatedProxies(rndUUID: any, eid: any, entityType: any): void;
        getViewEntityIDFromStream(stream: any): number;
        onUpdatePropertys_(eid: any, stream: any): void;
        Client_onUpdatePropertysOptimized(stream: any): void;
        Client_onUpdatePropertys(stream: any): void;
        onRemoteMethodCall_(eid: any, stream: any): void;
        Client_onRemoteMethodCallOptimized(stream: any): void;
        Client_onRemoteMethodCall(stream: any): void;
        Client_onEntityEnterWorld(stream: any): void;
        Client_onEntityLeaveWorldOptimized(stream: any): void;
        Client_onEntityLeaveWorld(eid: any): void;
        Client_onEntityDestroyed(eid: any): void;
        Client_onEntityEnterSpace(stream: any): void;
        Client_onEntityLeaveSpace(eid: any): void;
        Client_onKicked(failedcode: any): void;
        Client_onCreateAccountResult(stream: any): void;
        Client_onControlEntity(eid: any, isControlled: any): void;
        updatePlayerToServer(): void;
        addSpaceGeometryMapping(spaceID: any, respath: any): void;
        clearSpace(isAll: any): void;
        clearEntities(isAll: any): void;
        Client_initSpaceData(stream: any): void;
        Client_setSpaceData(spaceID: any, key: any, value: any): void;
        Client_delSpaceData(spaceID: any, key: any): void;
        Client_getSpaceData(spaceID: any, key: any): any;
        Client_onUpdateBasePos(x: any, y: any, z: any): void;
        Client_onUpdateBasePosXZ(x: any, z: any): void;
        Client_onUpdateData(stream: any): void;
        Client_onSetEntityPosAndDir(stream: any): void;
        Client_onUpdateData_ypr(stream: any): void;
        Client_onUpdateData_yp(stream: any): void;
        Client_onUpdateData_yr(stream: any): void;
        Client_onUpdateData_pr(stream: any): void;
        Client_onUpdateData_y(stream: any): void;
        Client_onUpdateData_p(stream: any): void;
        Client_onUpdateData_r(stream: any): void;
        Client_onUpdateData_xz(stream: any): void;
        Client_onUpdateData_xz_ypr(stream: any): void;
        Client_onUpdateData_xz_yp(stream: any): void;
        Client_onUpdateData_xz_yr(stream: any): void;
        Client_onUpdateData_xz_pr(stream: any): void;
        Client_onUpdateData_xz_y(stream: any): void;
        Client_onUpdateData_xz_p(stream: any): void;
        Client_onUpdateData_xz_r(stream: any): void;
        Client_onUpdateData_xyz(stream: any): void;
        Client_onUpdateData_xyz_ypr(stream: any): void;
        Client_onUpdateData_xyz_yp(stream: any): void;
        Client_onUpdateData_xyz_yr(stream: any): void;
        Client_onUpdateData_xyz_pr(stream: any): void;
        Client_onUpdateData_xyz_y(stream: any): void;
        Client_onUpdateData_xyz_p(stream: any): void;
        Client_onUpdateData_xyz_r(stream: any): void;
        _updateVolatileData(entityID: any, x: any, y: any, z: any, yaw: any, pitch: any, roll: any, isOnGround: any): void;
        Client_onStreamDataStarted(id: any, datasize: any, descr: any): void;
        Client_onStreamDataRecv(stream: any): void;
        Client_onStreamDataCompleted(id: any): void;
        Client_onReqAccountResetPasswordCB(failedcode: any): void;
        Client_onReqAccountBindEmailCB(failedcode: any): void;
        Client_onReqAccountNewPasswordCB(failedcode: any): void;
    }
    class ServerErr {
        name: string;
        descr: string;
        id: number;
    }
    let app: KBEngineApp;
    function create(args: KBEngineArgs): void;
    function destroy(): void;
}
