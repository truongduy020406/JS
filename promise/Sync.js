// sync / async
//bất đồng bộ 
// setTimeout, setinterval , fetch , 
//xmlhttprequest , đọc file
// request animation frame



//callback hell
//pyramid of doom


// var promise = new Promise(
//     //Excutor
//     function(resolve , reject){
//         //Logic
//         //Thành công : resolve()
//         //Thất bại : reject()
//         resolve();
//     }
// );

// const executeAsync = async()=>{
//     const reponse = await promise;
//     console.log(1)
//     const reponse2 = await promise1;
//     console.log(2)
//     const reponse3 = await promise2;
//     console.log(3)
// }
// executeAsync()

// promise
//     .then(function(){
//         return 1;
//     })
//     .then(function(data){
//         console.log(data)
//         return 2;
//     })

//     .catch(function(){
//         console.log("that bai")
//     })
//     .finally(function(){
//         console.log("done")
//     })


    var promise1 = new Promise(
        //Excutor
        function(resolve ){
           setTimeout(function(){
            resolve([1])
           },1000)
        }
    );
    var promise2 = new Promise(
        //Excutor
        function(resolve ){
           setTimeout(function(){
            resolve([2,3])
           },1000)
        }
    );
Promise.all([promise1,promise2])
        .then(function(resurt){
            console.log(resurt)
        })