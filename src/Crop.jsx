import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { Box, Button } from "@chakra-ui/react"
import { myCanvas, dataURL, canvasRef, MyContext, wrapperRef, panelStyle, DPR, tabRef } from "./App"

var parent, canvas
const controlStyle = {
    fontSize: ".8em",
    position: "absolute",
    width: "2em",
    height: "2em",
    border: "1px solid black",
    backgroundColor: "orange",
    textAlign: "center",
    color: "transparent",
    userSelect: "none"
}
const CropBox = ({ imageCropped }) => {
    const resize = { width: 0, height: 0, x: 0, y: 0, mouseX: 0, mouseY: 0, target: "" }
    const pos = [0, 0, 0, 0]
    canvas = { width: 0, height: 0, left: 0, top: 0 }
    var gap = { top: 0, right: 0, bottom: 0, left: 0 }, offsetLeft, offsetTop, prev = { x: { left: 0, right: 0 }, y: { top: 0, bottom: 0 } }
    parent = useRef(null)
    const { currentTab, medium } = useContext(MyContext)
    useEffect(() => {
        if (myCanvas.current) {
            canvas.width = myCanvas.current.width
            canvas.height = myCanvas.current.height
            canvas.left = myCanvas.current._offset.left
            canvas.top = myCanvas.current._offset.top
            if (!medium)
                canvas.top -= tabRef.current.getBoundingClientRect().top
            parent.current.style.left = canvas.left + "px"
            parent.current.style.top = canvas.top + "px"
            parent.current.style.width = canvas.width + "px"
            parent.current.style.height = canvas.height + "px"
            wrapperRef.current.style.zIndex = "15"
            if (currentTab === 14)
                wrapperRef.current.style.zIndex = "0"
        }

    }, [dataURL.current, currentTab, imageCropped])
    const Control = useCallback(({ props }) => {
        return (
            <Box style={{ ...controlStyle, ...props.style }} onMouseDown={e => resizeMouseDown(e)}>{props.index}</Box>
        )
    }, [])
    const dragMouseDown = useCallback(e => {
        e.preventDefault()
        resize.width = parseInt(parent.current.style.width.replace('px', ''))
        resize.height = parseInt(parent.current.style.height.replace('px', ''))
        pos[2] = e.clientX
        pos[3] = e.clientY
        window.onmousemove = dragMouseMove
        window.ontouchmove = dragMouseMove
        window.onmouseup = () => {
            window.onmousemove = null
            window.ontouchmove = null
            window.onmouseup = null
            window.ontouchend = null
        }
    }, [])
    const dragMouseMove = useCallback(e => {
        e.preventDefault()
        pos[0] = pos[2] - e.clientX
        pos[1] = pos[3] - e.clientY
        pos[2] = e.clientX
        pos[3] = e.clientY
        offsetLeft = parent.current.offsetLeft - pos[0]
        offsetTop = parent.current.offsetTop - pos[1]
        if (offsetLeft >= canvas.left && offsetLeft <= canvas.left + canvas.width - resize.width)
            parent.current.style.left = (parent.current.offsetLeft - pos[0]) + "px"
        if (offsetTop >= canvas.top && offsetTop <= canvas.top + canvas.height - resize.height)
            parent.current.style.top = (parent.current.offsetTop - pos[1]) + "px"
    }, [])
    const resizeMouseUp = useCallback(() => {
        resize.width = parseInt(parent.current.style.width.replace('px', ''))
        resize.height = parseInt(parent.current.style.height.replace('px', ''))
        const left = parseInt(parent.current.style.left.replace('px', ''))
        const top = parseInt(parent.current.style.top.replace('px', ''))
        const gapLeft = left - canvas.left
        const gapTop = top - canvas.top
        if (canvas.left > left) {
            parent.current.style.width = resize.width + (left - canvas.left) + "px"
            parent.current.style.left = left + (canvas.left - left) + "px"
        }
        if (canvas.top > top) {
            parent.current.style.height = resize.height + (top - canvas.top) + "px"
            parent.current.style.top = top + (canvas.top - top) + "px"
        }
        if (gapLeft + resize.width > canvas.width) {
            parent.current.style.width = gapLeft + resize.width - (gapLeft + resize.width - canvas.width) + "px"
            console.log("overflow")
        }
        if (gapTop + resize.height > canvas.height) {
            parent.current.style.height = gapTop + resize.height - (gapTop + resize.height - canvas.height) + "px"
        }
        window.onmousemove = null
        window.ontouchmove = null
        window.onmouseup = null
        window.ontouchend = null
    }, [])

    const resizeMouseDown = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        resize.width = parseInt(parent.current.style.width.replace('px', ''))
        resize.height = parseInt(parent.current.style.height.replace('px', ''))
        resize.x = parseInt(parent.current.style.left.replace('px', ''))
        resize.y = parseInt(parent.current.style.top.replace('px', ''))
        resize.mouseX = e.pageX
        resize.mouseY = e.pageY
        resize.target = e.target.textContent
        window.onmousemove = resizeMouseMove
        window.onmouseup = resizeMouseUp
    }, [])
    const resizeMouseMove = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        const p = parent.current
        var width, height
        gap.left = parseInt(p.style.left.replace('px', '')) - canvas.left
        gap.right = canvas.width - parseInt(p.style.width.replace('px', '')) - gap.left
        gap.top = parseInt(p.style.top.replace('px', '')) - canvas.top
        gap.bottom = canvas.height - parseInt(p.style.height.replace('px', '')) - gap.top
        switch (resize.target) {
            case "0":
                width = resize.width - (e.pageX - resize.mouseX)
                height = resize.height - (e.pageY - resize.mouseY)
                if (width > 0) {
                    if (gap.left >= 0 || prev.x.left - e.pageX < 0) {
                        p.style.width = width + "px"
                        p.style.left = resize.x + (e.pageX - resize.mouseX) + "px"
                        prev.x.left = e.pageX
                    }
                }
                if (height > 0) {
                    if (gap.top >= 0 || prev.y.top - e.pageY < 0) {
                        p.style.height = height + "px"
                        p.style.top = resize.y + (e.pageY - resize.mouseY) + "px"
                        prev.y.top = e.pageY
                    }
                }
                break
            case "1":
                width = resize.width + (e.pageX - resize.mouseX)
                height = resize.height - (e.pageY - resize.mouseY)
                if (width > 0) {
                    if (gap.right >= 0 || prev.x.right - e.pageX > 0) {
                        p.style.width = width + "px"
                        prev.x.right = e.pageX
                    }
                }
                if (height > 0) {
                    if (gap.top >= 0 || prev.y.top - e.pageY < 0) {
                        p.style.height = height + "px"
                        p.style.top = resize.y + (e.pageY - resize.mouseY) + "px"
                        prev.y.top = e.pageY
                    }
                }
                break
            case "3":
                width = resize.width - (e.pageX - resize.mouseX)
                height = resize.height + (e.pageY - resize.mouseY)
                if (height > 0) {
                    if (gap.bottom >= 0 || prev.y.bottom - e.pageY > 0) {
                        p.style.height = height + "px"
                        prev.y.bottom = e.pageY
                    }
                }
                if (width > 0) {
                    if (gap.left >= 0 || prev.x.left - e.pageX < 0) {
                        p.style.width = width + "px"
                        p.style.left = resize.x + (e.pageX - resize.mouseX) + "px"
                        prev.x.left = e.pageX
                    }
                }
                break
            case "2":
                width = resize.width + (e.pageX - resize.mouseX)
                height = resize.height + (e.pageY - resize.mouseY)
                if (width > 0) {
                    if (gap.right >= 0 || prev.x.right - e.pageX > 0) {
                        p.style.width = width + "px"
                        prev.x.right = e.pageX
                    }
                }
                if (height > 0) {
                    if (gap.bottom >= 0 || prev.y.bottom - e.pageY > 0) {
                        p.style.height = height + "px"
                        prev.y.top = e.pageY
                    }
                }
                break
            case "4":
                height = resize.height - (e.pageY - resize.mouseY)
                if (height > 0) {
                    if (gap.top > 0 || prev.y.top - e.pageY < 0) {
                        p.style.height = height + "px"
                        p.style.top = resize.y + (e.pageY - resize.mouseY) + "px"
                        prev.y.top = e.pageY
                    }
                }
                break
            case "5":
                width = resize.width + (e.pageX - resize.mouseX)
                if (gap.right > 0 || prev.x.right - e.pageX > 0) {
                    p.style.width = width + "px"
                    prev.x.right = e.pageX
                }
                break
            case "6":
                height = resize.height + (e.pageY - resize.mouseY)
                if (height > 0) {
                    if (gap.bottom > 0 || prev.y.bottom - e.pageY > 0) {
                        p.style.height = height + "px"
                        prev.y.bottom = e.pageY
                    }
                }
                break
            case "7":
                width = resize.width - (e.pageX - resize.mouseX)
                if (width > 0) {
                    if (gap.left > 0 || prev.x.left - e.pageX < 0) {
                        p.style.width = width + "px"
                        p.style.left = resize.x + (e.pageX - resize.mouseX) + "px"
                        prev.x.left = e.pageX
                    }
                }
                break
        }
    }, [])

    return (
        <Box ref={parent} position="absolute" width="75px" height="60px"
            cursor="move" onMouseDown={e => dragMouseDown(e)} onTouchStart={e => dragMouseDown(e)}
            outline="1px solid white" bg="#FFFFFF30" zIndex="10">
            {console.log("rendered crop box", parent.current?.style.top)}
            <Control props={{ index: 0, style: { left: "-1em", top: "-1em", clipPath: "polygon(0% 0%, 100% 0%,100% 35%,35% 35%,35% 100%,0% 100%)", cursor: "nwse-resize" } }} />
            <Control props={{ index: 4, style: { left: "50%", top: "-1em", transform: "translateX(-50%)", height: ".75em", cursor: "ns-resize" } }} />
            <Control props={{ index: 1, style: { right: "-1em", top: "-1em", clipPath: "polygon(0% 0%, 100% 0%, 100% 100%,70% 100%,70% 30%,0% 30%)", cursor: "nesw-resize" } }} />
            <Control props={{ index: 5, style: { right: "-1em", top: "50%", transform: "translateY(-50%)", width: ".75em", cursor: "ew-resize" } }} />
            <Control props={{ index: 3, style: { left: "-1em", bottom: "-1em", clipPath: "polygon(0% 0%,30% 0%,30% 70%,100% 70%,100% 100%,0% 100%)", cursor: "nesw-resize" } }} />
            <Control props={{ index: 7, style: { left: "-1em", top: "50%", transform: "translateY(-50%)", width: ".75em", cursor: "ew-resize" } }} />
            <Control props={{ index: 2, style: { right: "-1em", bottom: "-1em", clipPath: "polygon(70% 0%,100% 0%,100% 100%,0% 100%,0% 70%,70% 70%,70% 0%)", cursor: "nwse-resize" } }} />
            <Control props={{ index: 6, style: { left: "50%", bottom: "-1em", transform: "translateX(-50%)", height: ".75em", cursor: "ns-resize" } }} />
        </Box>
    )
}

export default function Crop() {
    const [imageCropped, setImageCropped] = useState(0)
    const { imgProps, setImgProps, addToHistory, eventFlag, medium } = useContext(MyContext)

    const onApply = useCallback(() => {
        let crop = {}
        for(let prop of ["width", "height", "left", "top"])
            crop[prop] = parseInt(parent.current.style[prop].replace('px', ''))
        const tempCanvasObjects = []
        while (myCanvas.current._objects.length > 1)
            tempCanvasObjects.push(myCanvas.current._objects.pop())
        myCanvas.current.renderAll()
        const ctx = myCanvas.current.getContext("2d")
        let offsetTop = myCanvas.current._offset.top
        if (!medium)
            offsetTop -= tabRef.current.getBoundingClientRect().top
        const topGap = crop.top - myCanvas.current._offset.top
        const leftGap = crop.left - myCanvas.current._offset.left
        const data = ctx.getImageData((crop.left - myCanvas.current._offset.left) * DPR, (crop.top - offsetTop) * DPR, crop.width * DPR, crop.height * DPR)
        eventFlag.current = false
        tempCanvasObjects.forEach(obj => {
            obj.left -= leftGap
            obj.top -= topGap
            myCanvas.current.add(obj)
        })
        eventFlag.current = true
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = crop.width * DPR
        tempCanvas.height = crop.height * DPR
        tempCanvas.getContext("2d").putImageData(data, 0, 0)
        tempCanvas.style.scale = `${1 / DPR}`
        const croppedImage = document.createElement("img")
        dataURL.current = croppedImage.src = tempCanvas.toDataURL(1.0)
        const finalImage = new fabric.Image(croppedImage)
        croppedImage.onload = () => {
            const data = [...myCanvas.current._objects]
            finalImage.width = croppedImage.naturalWidth
            finalImage.height = croppedImage.naturalHeight
            finalImage.scaleX = 1 / DPR
            finalImage.scaleY = 1 / DPR
            setImgProps({ ...imgProps, scaleX: 1 / DPR, scaleY: 1 / DPR })
            data[0] = finalImage
            myCanvas.current.dispose()
            myCanvas.current = new fabric.Canvas(canvasRef.current, {
                width: crop.width,
                height: crop.height
            })
            data.forEach(obj => myCanvas.current.add(obj))
            myCanvas.current.renderAll()
            setImageCropped(i => i + 1)
            addToHistory({ width: crop.width, height: crop.height }, null, { scaleX: 1 / DPR, scaleY: 1 / DPR }, [...myCanvas.current._objects])
        }
    }, [medium])
    return (
        <>
            <CropBox imageCropped={imageCropped} />
            <Box w="max-content" sx={panelStyle}>
                <Button onClick={onApply} bg="var(--input-bg)" border="1px solid var(--outline-color)" letterSpacing={1} color="var(--color)" _hover={{ bg: "#999" }} marginBottom=".4em">Apply
                </Button>
            </Box>
        </>
    )
}