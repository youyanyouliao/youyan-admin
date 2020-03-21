export function urlToFile(url, type) {
    return new Promise((resolve, reject) => {
            console.log(type)
            // let fileName = url.split(type + "/")[1].replace('.png', '');
            let fileName = url.split("img/")[1].replace('.png', '');
            let image = new Image();

            //解决跨域问题
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;

            //image.onload为异步加载
            image.onload = () => {
                let canvas = document.createElement("CANVAS");
                let context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);
                let dataurl = canvas.toDataURL("image/png");


                let arr = dataurl.split(',');
                let mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                let file = new File([u8arr], fileName, { type: mime });
                file.lastModifiedDate = new Date();

                resolve(file);
            }
            image.onerror = err => {
                reject(err);
            }
    })

}