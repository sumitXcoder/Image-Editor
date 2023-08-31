import React, { useEffect, useRef, useContext } from 'react'
import { Input, FormLabel, Grid, Select, Text as MyText, Flex } from "@chakra-ui/react"
import { myCanvas, MyContext, panelStyle } from './App'
import { BsFillCaretDownFill } from 'react-icons/bs'
const fontFamily = ["sans-serif", "serif", "Arial", "Helvetica", "Tahoma", "monospace", "Verdana", "Monaco", "Brush Script MT"]

export const img = document.createElement('img');
img.src = "https://raw.githubusercontent.com/sumitXcoder/Image-Editor/dddc0e879896e14c43bbb40ddd03cd388c86e58a/assets/remove.svg"
export default function Text() {
    const activeText = useRef(null)
    const { currentTab, medium } = useContext(MyContext)
    useEffect(() => {
        if (myCanvas.current && currentTab === 2) {
            myCanvas.current.on("mouse:down", e => {
                if (e.target instanceof fabric.IText)
                    activeText.current = e.target
            })

            var textProps = { fontFamily: "Arial", fontStyle: "normal", fontWeight: "300", fontSize: "15", backgroundColor: "#FFFFFF80", fill: "#000", cornerStyle: "circle", cornerStrokeColor: "#000", cornerSize: "20", padding: 15, cornerColor: "#FFFFFF", left: 50, top: 50, transparentCorners: false }
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
            <Grid w="15em" sx={medium ? { ...panelStyle, gridAutoFlow: "column", columnGap: "1em" } : { ...panelStyle, rowGap: ".5em" }} overflowX="auto" scrollSnapType="x mandatory" alignItems="center">
                <Flex justifyContent="space-between" width="13.5em" scrollSnapAlign="center" height="max-content">
                    <MyText>Family</MyText>
                    <Select bg="var(--input-bg)" placeholder="sans-serif" w="7.5em" h="2em" fontSize=".9em" icon={<BsFillCaretDownFill fontSize=".6em" />} border="1px solid var(--outline-color-low)" onChange={e => updateText("fontFamily", e.target.value)}>
                        {fontFamily.map(font => { return <option key={font} value={font} >{font}</option> })}
                    </Select>
                </Flex>
                <Flex justifyContent="space-between" width="13.5em" scrollSnapAlign="center" height="max-content">
                    <MyText >Style</MyText>
                    <Select bg="var(--input-bg)" placeholder="normal" w="7.5em" h="2em" fontSize=".9em" icon={<BsFillCaretDownFill fontSize=".6em" />} border="1px solid var(--outline-color-low)" onChange={e => updateText("fontStyle", e.target.value)}>
                        <option value="normal">normal</option>
                        <option value="italic">italic</option>
                    </Select>
                </Flex>
                <Flex justifyContent="space-between" width="13.5em" scrollSnapAlign="center" height="max-content">
                    <MyText>Weight</MyText>
                    <Input fontSize="1em" bg="var(--input-bg)" type="number" placeholder="300" w="7.5em" h="1.5em" _placeholder={{ color: "#aaa" }} textAlign="center" border="1px solid var(--outline-color-low)" onChange={e => updateText("fontWeight", e.target.value)} />
                </Flex>
                <Flex justifyContent="space-between" width="13.5em" scrollSnapAlign="center" height="max-content">
                    <MyText>Size</MyText>
                    <Input fontSize="1em" bg="var(--input-bg)" type="number" placeholder="12" w="7.5em" h="1.5em" _placeholder={{ color: "#aaa" }} textAlign="center" border="1px solid var(--outline-color-low)" onChange={e => updateText("fontSize", e.target.value)} />
                </Flex>
                <Flex justifyContent="space-around" width="13.5em" scrollSnapAlign="center" height="max-content">
                    <FormLabel fontSize="1em">Fill
                        <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color-low)" borderRadius=".25em" position="relative" top=".4em" left=".5em" p="0 .1em"
                            onChange={e => updateText("backgroundColor", e.target.value)} />
                    </FormLabel>
                    <FormLabel fontSize="1em">Color
                        <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color-low)" borderRadius=".25em" position="relative" top=".4em" left=".5em" p="0 .1em" onChange={e => updateText("fill", e.target.value)} />
                    </FormLabel>
                </Flex>
            </Grid>
        </>
    )
}
