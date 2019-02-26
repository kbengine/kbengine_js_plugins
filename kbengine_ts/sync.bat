REM 将这个脚本放于项目之中，项目框架更新后双击执行即可
REM 首次使用会问是文件或文件夹,一律选文件
REM 如果不是cocos creator,需要改下路径

REM 这里需要设置kbengine_ts路径
set kbengine=\

set libs=%cd%\assets\Libs
if not exist %libs% (
    mkdir %libs%
)

xcopy /y /c /h /r %frame%\bin\kbengine.d.ts %cd%\kbengine.d.ts

xcopy /y /c /h /r %frame%\bin\kbengine.js %libs%\kbengine.js
