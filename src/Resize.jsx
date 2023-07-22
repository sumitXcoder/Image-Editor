import React, { useState, useEffect, useRef, useContext } from 'react'
import { Box, Button, FormLabel, Input, Checkbox, HStack } from "@chakra-ui/react"
import { myCanvas, dataURL, MyContext, panelStyle } from "./App"

export default function Resize() {
    const { imgProps, setImgProps, addToHistory, canvasProps, setCanvasProps } = useContext(MyContext)
    const originalProps = useRef(null)
    const [props, setProps] = useState({ width: "", height: "", scaleChecked: true })
    useEffect(() => {
        if (myCanvas.current) {
            const imgWidth = myCanvas.current._objects[0].width
            const imgHeight = myCanvas.current._objects[0].height
            originalProps.current = { width: imgWidth, height: imgHeight, scaleFactor: imgWidth / imgHeight }
        }
    }, [dataURL.current])

    const updateProps = (prop, value) => {
        value = parseInt(value)
        if (isNaN(value)) {
            if (props.scaleChecked)
                setProps({ ...props, width: "", height: "" })
            else
                prop === "width" ? setProps({ ...props, width: "" }) : setProps({ ...props, height: "" })
        }
        else {
            if (props.scaleChecked) {
                if (prop === "width") {
                    const height = Math.round((1 / originalProps.current.scaleFactor) * value)
                    setProps({ ...props, width: value, height: height })
                } else {
                    const width = Math.round(originalProps.current.scaleFactor * value)
                    setProps({ ...props, width: width, height: value })
                }
            } else {
                prop === "width" ? setProps({ ...props, width: value }) : setProps({ ...props, height: value })
            }
        }
    }

    const onCancel = () => {
        setProps({ width: "", height: "", scaleChecked: true })
    }

    const onApply = () => {
        const newProps = { scaleX: props.width / originalProps.current.width, scaleY: props.height / originalProps.current.height }
        setImgProps({ ...imgProps, ...newProps })
        setCanvasProps({ width: props.width, height: props.height })
        addToHistory({ width: props.width, height: props.height }, null, newProps, null)
    }
    return (
        <Box w="max-content" sx={panelStyle}>
            <HStack>
                <FormLabel htmlFor="resize-width" mr="17px">Width</FormLabel>
                <Input type="number" id="resize-width" height="1.5em" width="6em" mb=".5em" onChange={e => updateProps("width", e.target.value)} value={props?.width} textAlign="center" border="1px solid var(--outline-color)" bg="var(--input-bg)" /></HStack>
            <HStack>
                <FormLabel htmlFor="resize-height">Height</FormLabel>
                <Input type="number" id="resize-height" height="1.5em" width="6em" mb=".5em" onChange={e => updateProps("height", e.target.value)} value={props?.height} textAlign="center" border="1px solid var(--outline-color)" bg="var(--input-bg)" />
            </HStack>
            <Checkbox defaultChecked onChange={e => setProps({ ...props, scaleChecked: e.target.checked })} mb=".5em" >Scale Proportionately</Checkbox>
            <HStack>
                <Button onClick={onCancel} bg="var(--input-bg)" border="1px solid var(--outline-color)" letterSpacing={1} color="var(--color)" _hover={{ bg: "#999" }}>Cancel</Button>
                <Button onClick={onApply} bg="var(--input-bg)" border="1px solid var(--outline-color)" letterSpacing={1} color="var(--color)" _hover={{ bg: "#999" }}>Apply</Button>
            </HStack>
        </Box>
    )
}