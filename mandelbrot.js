

window.onload = ()=> {

    let w = window.innerHeight;
    let h = window.innerHeight;

    console.log(w, h)

    let center = new THREE.Vector3(0, 0, 0)

    let zoomFactor = 1
    let rangeFactor = 2

    let minX = -2
    let maxX = 2
    let minY = -2
    let maxY = 2
   
    let map = (x, minIn, maxIn, minOut, maxOut) => {

        return (x - minIn) * (maxOut - minOut) / (maxIn -minIn) + minOut
    }

    let setRangeByCenter = (_x, _y)=> {
        
        let x = map(_x, 0, w, minX, maxX)
        let y = map(_y, 0, h, minY, maxY)

        minX = (-rangeFactor * zoomFactor) + x
        maxX = (rangeFactor * zoomFactor) + x

        minY = (-rangeFactor * zoomFactor) + y
        maxY = (rangeFactor * zoomFactor) + y

        console.log('range', minX, maxX, minY, maxY)
    }
    setRangeByCenter(w / 2, h / 2)


    let container = document.querySelector('#webGL');
    container.style.width = w + 'px'
    container.style.height = h + 'px'
    let ctx = container.getContext('2d')

    ctx.canvas.width = w
    ctx.canvas.height = h

    // let renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(w, h);
    // renderer.setClearColor(new THREE.Color(0x999999));
    // let camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, .1, 1000);
    // camera.position.set(center.x, 100, center.z);
    // camera.lookAt(center);

    // let orbit = new THREE.OrbitControls(camera, renderer.domElement)

    // let scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x999999);

    // container.append(renderer.domElement);

    // let light = new THREE.AmbientLight()
    // scene.add(light)


    // let geo = new THREE.PlaneBufferGeometry(1, 1)
    // geo.rotateX(-Math.PI / 2)

    // let mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x000000)})

    // let mesh = new THREE.Mesh(geo, mat)
    // scene.add(mesh)

    let imageData = ctx.getImageData(0, 0, w, h)
    let data = imageData.data

    let mandelbrotDraw = ()=> {

        // scene.children.forEach(o=> {
        //     scene.remove(o)
        // })

        let maxIterations = 50

        for(let x = 0; x < w; x++) {

            for(let y = 0; y < h; y++) {

                let a = map(x, 0, w, minX, maxX)
                let b = map(y, 0, h, minY, maxY)

                let complexA = a
                let complexB = b
                
                let n = 0
                for(; n <= maxIterations; n++) {
                    
                    let A = a * a - b * b
                    let B = 2 * a * b

                    a = A + complexA
                    b = B + complexB

                    if(a + b > 16)
                        break
                }

                let bright = map(n, 0, maxIterations, 0, 1)
                bright = map(Math.sqrt(bright), 0, 1, 0, 200)

                if(n >= maxIterations) 
                    bright = 255
                
                // DRAW PIXEL

                let pix = (x + y * w) * 4
                data[pix + 0] = bright 
                data[pix + 1] = bright
                data[pix + 2] = bright
                data[pix + 3] = 255

                // let m = mat.clone()
                // m.color = new THREE.Color().setRGB(bright, bright, bright)

                // let mesh = new THREE.Mesh(geo, m)
                // mesh.position.set(x, 0, y)

                // scene.add(mesh)

            }
        }

    }

    // let renderTime = Date.now()
    // let loop = ()=> {

    //     requestAnimationFrame(loop);


    //     if(Date.now() - renderTime > 100) {
    //         renderTime = Date.now()
    //     }
    //     else return

    //     // renderer.render(scene, camera)
        
    // }
    // loop()


    // renderer.render(scene, camera)


    mandelbrotDraw()

    // let bIn = document.querySelector('#zoomIn')
    // let bOut = document.querySelector('#zoomOut')

    // bIn.addEventListener('click', ()=> {

    //     setRangeByCenter(0, 0)

    //     zoomFactor *= .1

    //     mandelbrotDraw()

    // }, false)

    // bOut.addEventListener('click', ()=> {

    //     setRangeByCenter(0, 0)

    //     zoomFactor *= 1.1
        
    //     mandelbrotDraw()

    // }, false)

    container.addEventListener('mousedown', (e)=> {

        console.log('down', e)

        if(e.which == '1' && !e.shiftKey) {

            zoomFactor *= .5
        }
        else if(e.which == '1' && e.shiftKey) {

            zoomFactor *= 1.5
        }
        else return

        setRangeByCenter(e.clientX, e.clientY)

        mandelbrotDraw()

        ctx.putImageData(imageData, 0, 0)

    }, false)
    
    container.addEventListener('mouseup', (e)=> {

        // console.log('up')

    }, false)
    
    container.addEventListener('mousemove', (e)=> {

        // console.log('move', e.clientY)

    }, false)
    
    container.addEventListener('mousewheel', (e)=> {

        console.log('wheel', e)

        if(e.deltaY < 0) zoomFactor *= .5
        else if(e.deltaY > 0) zoomFactor *= 1.5

        setRangeByCenter(e.clientX, e.clientY)

        mandelbrotDraw()

        ctx.putImageData(imageData, 0, 0)

    }, false)

    ctx.putImageData(imageData, 0, 0)
}