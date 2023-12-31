import { useContext, useRef,useCallback } from "react"
import { MyContext, panelStyle, SliderContent } from "./App"
import { Box, Text, Button, Slider, Flex, FormLabel, Input, Select, Grid, HStack, useCheckbox, chakra } from "@chakra-ui/react"
import { BsFillCaretDownFill } from 'react-icons/bs';
import { Property } from "./Adjust"

export const MyCheckbox = (props) => {
    const { state, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)
    return (
        <chakra.label display='flex' bg={state.isChecked ? 'var(--active-tab-color)' : 'var(--top-button-bg)'} boxShadow={state.isChecked ? "0 0 1px 1px lightblue" : "none"} rounded='md' cursor='pointer' outline="1px solid var(--outline-color-low)" justifyContent="center" {...htmlProps} >
            <input {...getInputProps()} hidden />
            <Text color="var(--color)" p=".25em" {...getLabelProps()}>{getInputProps().value}</Text>
        </chakra.label>
    )
}
export const Pixelate = () => {
    const { filters, setFilters, addToHistory } = useContext(MyContext)
    return (
        <Box w="15em" sx={panelStyle}>
            <Property prop="blocksize" value={filters.blocksize || 1} />
            <Slider defaultValue={1} min={1} max={100} onChangeEnd={value => {
                setFilters({ ...filters, blocksize: value })
                addToHistory(null, { blocksize: value }, null, null)
            }}><SliderContent />
            </Slider>
        </Box>
    )
}

export const Blur = () => {
    const { filters, setFilters, filterValue, addToHistory } = useContext(MyContext)
    return (
        <Box w="15em" sx={panelStyle}>
            <Property prop="blur" value={filterValue(filters.blur)} />
            <Slider defaultValue={0} min={0} max={100} onChangeEnd={value => {
                setFilters({ ...filters, blur: value / 100 })
                addToHistory(null, { blur: value / 100 }, null, null)
            }}>
                <SliderContent />
            </Slider>
        </Box>
    )
}

export const Vibrance = () => {
    const { filters, setFilters, filterValue, addToHistory } = useContext(MyContext)
    return (
        <Box w="15em" sx={panelStyle}>
            <Property prop="vibrance" value={filterValue(filters.vibrance)} />
            <Slider defaultValue={0} min={-200} max={200} onChange={value => setFilters({ ...filters, vibrance: value / 100 })} onChangeEnd={value => {
                setFilters({ ...filters, vibrance: value / 100 })
                addToHistory(null, { vibrance: value / 100 }, null, null)
            }
            }>
                <SliderContent />
            </Slider>
        </Box>
    )
}

export const Noise = () => {
    const { filters, setFilters, addToHistory } = useContext(MyContext)
    return (
        <Box w="15em" sx={panelStyle}>
            <Property prop="noise" value={filters.noise || 0} />
            <Slider defaultValue={0} min={0} max={200} onChangeEnd={value => {
                setFilters({ ...filters, noise: value })
                addToHistory(null, { noise: value }, null, null)
            }}>
                <SliderContent />
            </Slider>
        </Box>
    )
}

export const RemoveColor = () => {
    const { filters, setFilters, addToHistory, medium } = useContext(MyContext)
    return (
        <Grid w="15em" sx={panelStyle} overflowX="auto" gap=".5em 1em" gridAutoFlow={medium ? "column" : "row"} scrollSnapType="x mandatory">
            <Box width="13.5em" scrollSnapAlign="center">
                <Property prop="removeColor" value={filters.hasOwnProperty("removeColor") && filters.removeColor.hasOwnProperty("distance") ? Math.round(filters.removeColor.distance * 100) : 0} />
                <Slider defaultValue={0} min={0} max={100} onChangeEnd={value => {
                    setFilters({ ...filters, removeColor: { distance: value / 100 } })
                    addToHistory(null, { removeColor: { distance: value / 100 } }, null, null)
                }}>
                    <SliderContent />
                </Slider>
            </Box>
            <FormLabel width="10em" scrollSnapAlign="center">Color
                <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color)" position="relative" top=".4em" left="1em" onChange={color => setFilters({ ...filters, removeColor: { color: color.target.value } })} />
            </FormLabel>
        </Grid>
    )
}

export const Gamma = () => {
    const { filters, setFilters, addToHistory, medium } = useContext(MyContext)

    const gammaValue = (index, value, end = false) => {
        const values = { ...filters }
        filters.hasOwnProperty("Gamma") ? values.Gamma.gamma[index] = value : values["Gamma"] = { gamma: [1.00, 1.00, 1.00] }
        end ? addToHistory(null, { Gamma: { gamma: [...values.Gamma.gamma] } }, null, null) : setFilters(values)
    }
    return (
        <Flex sx={medium ? { ...panelStyle, width: "auto", overflowX: "auto", columnGap: ".5em" } : { ...panelStyle, flexFlow: "column", width: "15em" }}>
            <Box>
                <Property prop="Red" value={filters.hasOwnProperty("Gamma") ? (filters.Gamma.gamma[0]).toPrecision(3) : "1.00"} />
                <Slider defaultValue={1.00} min={0} max={10} step={0.01} onChangeEnd={value => {
                    gammaValue(0, value)
                    gammaValue(0, value, true)
                }}>
                    <SliderContent />
                </Slider>
            </Box>
            <Box>
                <Property prop="Green" value={filters.hasOwnProperty("Gamma") ? (filters.Gamma.gamma[1]).toPrecision(3) : "1.00"} />
                <Slider defaultValue={1.00} min={0} max={10} step={0.01} onChangeEnd={value => {
                    gammaValue(1, value)
                    gammaValue(1, value, true)
                }}>
                    <SliderContent />
                </Slider></Box>
            <Box>
                <Property prop="Blue" value={filters.hasOwnProperty("Gamma") ? (filters.Gamma.gamma[2]).toPrecision(3) : "1.00"} />
                <Slider defaultValue={1.00} min={0} max={10} step={0.01} onChangeEnd={value => {
                    gammaValue(2, value)
                    gammaValue(2, value, true)
                }}>
                    <SliderContent />
                </Slider>
            </Box>
        </Flex>
    )
}

const effects = {
    Identity: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    Sharpen1: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    Sharpen2: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
    Lighten: [0, 0, 0, 0, 2, 0, 0, 0, 0],
    Darken: [0, 0, 0, 0, 0.5, 0, 0, 0, 0],
    BoxBlur: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
    GaussianBlur: [1 / 16, 1 / 8, 1 / 16, 1 / 8, 1 / 4, 1 / 8, 1 / 16, 1 / 8, 1 / 16],
    EdgeDetection: [0, 1, 0, 1, -4, 1, 0, 1, 0],
    Emboss1: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
    Emboss2: [-2, -1, 0, -1, 1, 1, 0, 1, 2]
}
export const Convolute = () => {
    const { filters, setFilters, addToHistory } = useContext(MyContext)
    return (
        <Box w="max-content" sx={panelStyle}>
            <Flex justifyContent="space-between" >
                <Text fontWeight="400" letterSpacing="1px" fontSize={15} mr="2em" mt=".2em">Effect</Text>
                <Select fontSize=".9em" h="2em" w="7em" border="1px solid var(--outline-color)" icon={<BsFillCaretDownFill fontSize=".6em" />} onChange={e => {
                    setFilters({ ...filters, Convolute: { matrix: effects[e.target.value] } })
                    addToHistory(null, { Convolute: { matrix: effects[e.target.value] } }, null, null)
                }}>{Object.keys(effects).map(effect => { return <option key={effect} value={effect}>{effect}</option> })}</Select>
            </Flex>
        </Box>
    )
}

export const Rotate = () => {
    const { imgProps, setImgProps, addToHistory, medium } = useContext(MyContext)
    const angle = useRef(0)
    const updateImgProps = useCallback((prop, value) => {
        if (prop === "rotate") {
            setImgProps({ ...imgProps, rotate: value })
            angle.current = value
        }
        else if (prop === "rotate90")
            if (imgProps.hasOwnProperty("rotate")) {
                setImgProps({ ...imgProps, rotate: imgProps.rotate + value })
                addToHistory(null, null, { rotate: imgProps.rotate + value }, null)
            } else {
                setImgProps({ ...imgProps, rotate: value })
                addToHistory(null, null, { rotate: value }, null)
            }
        else {
            let newProp = {}
            newProp[prop] = value
            setImgProps({ ...imgProps, ...newProp })
            addToHistory(null, null, newProp, null)
        }
    },[])
    return (
        <>
            <Grid w="15em" sx={panelStyle} gridAutoFlow={medium ? "column" : "row"} overflowX="auto" gap=".5em 1em" scrollSnapType="x mandatory">
                <Box width="13.5em" scrollSnapAlign="center">
                    <Flex justifyContent="space-between">
                        <Text fontWeight="400" letterSpacing="1px" fontSize={15}>Rotation</Text>
                        <Box fontSize={14} border="1px solid var(--outline-color-low)" padding="0px 5px" borderRadius=".25em">{angle.current > 0 ? "+" + angle.current : angle.current}°</Box>
                    </Flex>
                    <Slider defaultValue={0} min={-180} max={180} onChange={e => updateImgProps("rotate", e)} onChangeEnd={(value) => addToHistory(null, null, { rotate: value }, null)
                    }>
                        <SliderContent />
                    </Slider>
                </Box>
                <Flex justifyContent="space-between" alignItems="center" width="13.5em" scrollSnapAlign="center">
                    Rotate
                    <HStack>
                        <Button size="" p="7px" onClick={e => updateImgProps("rotate90", -90)} bg="var(--top-button-bg)" color="var(--color)" outline="1px solid var(--outline-color-low)" _hover={{ outlineColor: "var(--outline-color)" }} > -90°</Button>
                        <Button size="" p="7px" onClick={e => updateImgProps("rotate90", 90)} bg="var(--top-button-bg)" color="var(--color)" outline="1px solid var(--outline-color-low)" _hover={{ outlineColor: "var(--outline-color)" }} > 90°</Button>
                    </HStack>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center" width="13.5em" scrollSnapAlign="center">Flip
                    <HStack spacing=".5em">
                        <MyCheckbox w="2.75em" value="flipX" onChange={e => updateImgProps("flipX", e.target.checked)} />
                        <MyCheckbox w="2.75em" value="flipY" onChange={e => updateImgProps("flipY", e.target.checked)} />
                    </HStack>
                </Flex>
            </Grid>
        </>
    )
}
const imageFilterStyle = {
    large: {
        gridTemplateColumns: "auto",
        width: "10em",
        gap: ".5em"
    },
    medium: {
        gridTemplateColumns: "repeat(9,1fr)",
        width: "auto",
        overflowX: "auto",
        gap: ".5em"
    }
}
export const ImageFilters = () => {
    const fabricImageFilters = ["Brownie", "Sepia", "Vintage", "Technicolor", "Polaroid", "Kodachrome", "BlackWhite", "Grayscale", "Invert"]
    const { filters, setFilters, addToHistory, medium } = useContext(MyContext)

    const updateFilters = (e) => {
        let imgFilter = {}
        if (e.target.checked) {
            imgFilter[e.target.value] = "imageFilter"
            setFilters({ ...filters, ...imgFilter })
            addToHistory(null, imgFilter, null, null)
        } else {
            imgFilter = { ...filters }
            delete imgFilter[e.target.value]
            setFilters(imgFilter)
            addToHistory(null, e.target.value, null, null)
        }
    }
    return (
        <Grid sx={medium ? { ...panelStyle, ...imageFilterStyle.medium } : { ...panelStyle, ...imageFilterStyle.large }}>{fabricImageFilters.map(filter => {
            return <MyCheckbox key={filter} value={filter} onChange={e => updateFilters(e)} />
        })}</Grid>
    )
}


// export const BlendColor = () => {
//     const blendModes = ["Add", "diff", "Subtract", "Multiply", "Screen", "Lighten", "Darken", "Overlay", "Exclusion", "Tint"]
//     const { isOpen, onToggle } = useDisclosure()
//     const { filters, setFilters } = useContext(MyContext)
//     const blend = (prop, value) => {
//         const values = { ...filters }
//         // console.log(prop,value)
//         // try{
//         //     values.BlendColor[prop]=value
//         // }catch(e){
//         //     values["BlendColor"]={color:"#000",mode:"Add",alpha:1}
//         //     values["BlendColor"][prop]=value
//         //     console.log(e)
//         // }finally{
//         //     setFilters(values)
//         // }
//         filters.hasOwnProperty("BlendColor") ? values.BlendColor[prop] = value : values["BlendColor"] = { color: "#000000", mode: "Add", alpha: 1 }
//         setFilters(values)
//     }
//     return (
//         <>
//             <Button mb=".25em" w="7.5em" onClick={onToggle} zIndex={2}>Blend Color</Button>
//             <Slide direction="left" in={isOpen} >
//                 <Grid bg="rgba(100,100,100,.5)" color="white"  p="1em" shadow={10} backdropFilter="blur(10px)" outline="1px solid var(--outline-color)"  borderRadius=".5em" gridTemplateColumns="auto auto" gap="1em" w="max-content">
//                     <FormLabel fontWeight="400" letterSpacing="1px" fontSize={15} htmlFor="blend-color">Color
//                     </FormLabel>
//                     <Input id="blend-color" type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color)" borderRadius=".25em" paddingInline=".1em" onChange={color => blend("color", color.target.value)} />
//                     <Text fontWeight="400" letterSpacing="1px" fontSize={15}>Mode</Text>
//                     <Select fontSize=".8em" h="2em" w="7em" border="1px solid var(--outline-color)" icon={<BsFillCaretDownFill fontSize=".6em" />} onChange={mode => blend("mode", mode.target.value)} >{blendModes.map(mode => { return <option key={mode} value={mode}>{mode}</option> })}</Select>
//                     <Text fontWeight="400" letterSpacing="1px" fontSize={15}>Alpha</Text>
//                     <Box fontSize={14} border="1px solid var(--outline-color-low)" padding="0px 5px" borderRadius=".25em" w="max-content">{filters.hasOwnProperty("BlendColor") ? (filters.BlendColor.alpha).toPrecision(2) : 1}</Box>
//                     <Slider defaultValue={1} min={0} max={1} step={0.01} onChange={value => blend("alpha", value)} gridColumn="1/span 2">
//                         <SliderTrack bg="gray" h="3px">
//                             <SliderFilledTrack />
//                         </SliderTrack>
//                         <SliderThumb />
//                     </Slider>
//                 </Grid>
//             </Slide>
//         </>
//     )
// }