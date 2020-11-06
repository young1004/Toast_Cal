
// 디버그용 js 파일
// 디버그할 때만 씁시다

/** 
 * c언어 sleep 구현
 * @param {Number} delay 코드를 멈출 시간을 초단위로 입력
 */
function sleep (delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + (delay * 1000));
 }

//  function showFuntions(obj){

//     // console.dir(obj.prototype);

//     for(var key in obj.prototype)
//         console.log(key);

//  }