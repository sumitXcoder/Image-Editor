import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, FormLabel, Input, Checkbox, HStack, Flex } from "@chakra-ui/react"
import { myCanvas, dataURL, MyContext, panelStyle } from "./App"

const Dimension = ({ measure, onChange, state }) => {
    return (
        <HStack width="12em" scrollSnapAlign="center">
            <FormLabel htmlFor={"resize" + measure} marginRight={measure === "width" ? "1.1em" : ".75em"}>{measure.replace(measure[0], measure[0].toUpperCase())}
            </FormLabel>
            <Input type="number" id={"resize" + measure} height="1.5em" width="6em" mb=".5em" onChange={e => onChange(measure, e.target.value)} value={state?.width} textAlign="center" border="1px solid var(--outline-color)" bg="var(--input-bg)" />
        </HStack>
    )
}
export default function Resize() {
    const { imgProps, setImgProps, addToHistory, setCanvasProps, medium } = useContext(MyContext)
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
        <Flex gap=".5em 1em" w="15em" sx={panelStyle} overflowX="auto" scrollSnapType="x mandatory" flexFlow={medium ? "row" : "column"}>
            <Dimension measure="width" onChange={updateProps} state={props} />
            <Dimension measure="height" onChange={updateProps} state={props} />
            <Checkbox defaultChecked onChange={e => setProps({ ...props, scaleChecked: e.target.checked })} mb=".5em" whiteSpace="nowrap" scrollSnapAlign="center">
                Scale Proportionately
            </Checkbox>
            <HStack width="12em" scrollSnapAlign="center">
                <Button onClick={onCancel} bg="var(--input-bg)" border="1px solid var(--outline-color)" letterSpacing={1} color="var(--color)" _hover={{ bg: "#999" }}>Cancel</Button>
                <Button onClick={onApply} bg="var(--input-bg)" border="1px solid var(--outline-color)" letterSpacing={1} color="var(--color)" _hover={{ bg: "#999" }}>Apply</Button>
            </HStack>
        </Flex>
    )
}