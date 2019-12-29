
const timeout = (time) => {
   return new Promise((resolve, reject) => {
    console.log('timout fn start');
        const timeoutFunction = () => {
            setTimeout(() => {
                console.log('timout fn end');
                return resolve('timeout end');
            }, time);
        };
        timeoutFunction();
    });
};


module.exports = { time: async (time) => { await timeout(time) } };