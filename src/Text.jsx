import React, { useEffect, useRef, useContext } from 'react'
import { Input, FormLabel, Grid, Select } from "@chakra-ui/react"
import { myCanvas, MyContext } from './App'
import { BsFillCaretDownFill } from 'react-icons/bs';
const fontFamily = ["sans-serif", "serif", "Arial", "Helvetica", "Tahoma", "monospace", "Verdana", "Monaco", "Brush Script MT"]

const img = document.createElement('img');
img.src = "assets/remove.svg";
export default function Text() {
    var i = 0
    const activeText = useRef(null)
    const { currentTab } = useContext(MyContext)
    useEffect(() => {
        if (myCanvas.current && currentTab === 2) {
            myCanvas.current.on("mouse:down", e => {
                if (e.target instanceof fabric.IText)
                    activeText.current = e.target
            })

            var textProps = { fontFamily: "Arial", fontStyle: "normal", fontWeight: "300", fontSize: "15", backgroundColor: "#FFFFFF80", fill: "#000", cornerStyle: "circle", cornerStrokeColor: "#000", cornerSize: "20", padding: 15, cornerColor: "#FFFFFF",left:50,top:50, transparentCorners: false }
            activeText.current = new fabric.IText("Enter text", textProps)
            fabric.Object.prototype.controls.deleteControl = new fabric.Control({
                x: -0.5,
                y: -0.5,
                cursorStyle: 'pointer',
                mouseUpHandler: function () {
                    myCanvas.current.remove(myCanvas.current.getActiveObject());
                },
                render: function (ctx, left, top) {
                    const size = this.cornerSize;
                    ctx.translate(left, top);
                    ctx.drawImage(img, -size / 2, -size / 2, size, size);
                },
                cornerSize: 20
            });
            // myCanvas.current.setActiveObject(activeText.current)
            myCanvas.current.add(activeText.current)
        }
    }, [currentTab])

    const updateText = (prop, value) => {
        activeText.current.set("dirty", true)
        activeText.current.set(prop, value)
        myCanvas.current.renderAll()
    }

    return (
        <>
            <Grid w="15em" bg="var(--panel-bg)" color="var(--color)" p="1em" shadow={10} backdropFilter="blur(10px)" outline="1px solid rgba(255,255,255,.4)" borderRadius=".5em" gridTemplateColumns="auto auto" rowGap=".5em" boxShadow="0 0 10px 1px rgba(25,25,25,.25)">
                <p>Family</p>
                <Select bg="var(--input-bg)" placeholder="sans-serif" w="100%" h="2em" fontSize=".9em" icon={<BsFillCaretDownFill fontSize=".6em" />} border="1px solid var(--outline-color-low)" onChange={e => updateText("fontFamily", e.target.value)}>
                    {fontFamily.map(font => { return <option key={i++} value={font} >{font}</option> })}
                </Select>
                <p >Style</p>
                <Select bg="var(--input-bg)" placeholder="normal" w="100%" h="2em" fontSize=".9em" icon={<BsFillCaretDownFill fontSize=".6em" />} border="1px solid var(--outline-color-low)" onChange={e => updateText("fontStyle", e.target.value)}>
                    <option value="normal">normal</option>
                    <option value="italic">italic</option>
                </Select>
                <p>Weight</p>
                <Input bg="var(--input-bg)" type="number" placeholder="300" h="1.5em" _placeholder={{ color: "#aaa" }} textAlign="center" border="1px solid var(--outline-color-low)" onChange={e => updateText("fontWeight", e.target.value)} />
                <p>Size</p>
                <Input bg="var(--input-bg)" type="number" placeholder="12" h="1.5em" _placeholder={{ color: "#aaa" }} textAlign="center" border="1px solid var(--outline-color-low)" onChange={e => updateText("fontSize", e.target.value)} />
                <FormLabel>Fill
                    <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color-low)" borderRadius=".25em" position="relative" top=".4em" left="1em" mr="1.5em" p="0 .1em"
                        onChange={e => updateText("backgroundColor", e.target.value)} />
                </FormLabel>
                <FormLabel>Color
                    <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color-low)" borderRadius=".25em" position="relative" top=".4em" left="1em" p="0 .1em" onChange={e => updateText("fill", e.target.value)} />
                </FormLabel>
            </Grid>
        </>
    )
}
