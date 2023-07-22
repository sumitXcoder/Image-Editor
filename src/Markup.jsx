import { useState, useEffect, useContext } from "react"
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Input, FormLabel, Text, Slider, Flex} from "@chakra-ui/react"
import { myCanvas, MyContext, panelStyle, SliderContent,dataURL } from "./App"
import { BsPencil, BsCircle, BsEraser } from 'react-icons/bs'
import { TfiSpray, TfiMarker } from 'react-icons/tfi'
import { MyCheckbox } from "./Filters"

const Property = ({ prop, index }) => {
    return (
        <Flex justifyContent="space-between">
            <Text fontWeight="400" letterSpacing="1px" fontSize={15}>{prop.replace(prop[0], prop[0].toUpperCase())}</Text>
            <Box fontSize={14} border="1px solid var(--outline-color-low)" padding="0px 5px" borderRadius=".25em">{index[prop]}</Box>
        </Flex>
    )
}


const MySlider = ({ min = 0, max = 100, defaultValue = 2, value, callback }) => {
    return (
        <Slider min={min} max={max} defaultValue={defaultValue} onChange={e => callback({ [value]: e })}>
            <SliderContent />
        </Slider>
    )
}
export default function Markup() {
    const { currentTab, addToHistory } = useContext(MyContext)
    const brushType = ["Pencil", "Circle", "Spray", "Marker", "Eraser"]
    const [tab, setTab] = useState(0)
    const [brushes, setBrushes] = useState([{ width: 2, color: "#000" }, { width: 2, color: "#000" }, { width: 30, color: "#000", density: 50 }, { width: 2, color: "#000" }, { width: 5 }])
    var i = 0
    const handleChange = obj => {
        const data = [...brushes]
        Object.assign(data[tab], obj)
        setBrushes(data)
    }

    useEffect(() => {
        if (myCanvas.current)
            myCanvas.current.isDrawingMode = currentTab === 1
    }, [currentTab])

    useEffect(() => {
        if (myCanvas.current) {
            const brush = new fabric[brushType[tab] + "Brush"](myCanvas.current)
            Object.assign(brush, brushes[tab])
            myCanvas.current.freeDrawingBrush = brush
        }
    }, [brushes, tab])

    myCanvas.current?.on("mouse:up", () => {
        if (tab === 4 && myCanvas.current._objects[0].erasable) {
            dataURL.current = myCanvas.current.toDataURL(1.0)
            console.log("event fired")
            addToHistory(null, null, null, [...myCanvas.current._objects])
        }

    })
    return (
        <>
            <Box w="max-content" sx={panelStyle}>
                <Tabs variant="unstyled" onChange={index => setTab(index)}>
                    <TabList>
                        {[<BsPencil />, <BsCircle />, <TfiSpray />, <TfiMarker />, <BsEraser />].map(item => {
                            return (<Tab key={i++} color="var(--color)" _selected={{ boxShadow: "0 0 1px 1px lightblue", bg: "var(--active-tab-color)", borderRadius: ".25em" }}>{item}</Tab>)
                        })}
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Property prop={"width"} index={brushes[0]} />
                            <MySlider value={"width"} callback={handleChange} />
                            <FormLabel>Color
                                <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color)" position="relative" top=".4em" left="1em" onChange={color => handleChange({ color: color.target.value.toUpperCase() })} />
                            </FormLabel>
                        </TabPanel>
                        <TabPanel>
                            <Property prop="width" index={brushes[1]} />
                            <MySlider value={"width"} callback={handleChange} />
                            <FormLabel>Color
                                <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color)" position="relative" top=".4em" left="1em" onChange={color => handleChange({ color: color.target.value.toUpperCase() })
                                } />
                            </FormLabel>
                        </TabPanel>
                        <TabPanel>
                            <Property prop="width" index={brushes[2]} />
                            <MySlider defaultValue={30} value={"width"} callback={handleChange} />
                            <Property prop="density" index={brushes[2]} />
                            <MySlider defaultValue={50} value={"density"} callback={handleChange} />
                            <FormLabel>Color
                                <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color)" position="relative" top=".4em" left="1em" onChange={color => handleChange({ color: color.target.value.toUpperCase() })
                                } />
                            </FormLabel>
                        </TabPanel>
                        <TabPanel>
                            <Property prop="width" index={brushes[3]} />
                            <MySlider value={"width"} callback={handleChange} />
                            <FormLabel>Color
                                <Input type="color" size="2em" width="2em" height="2em" border="1px solid var(--outline-color)" position="relative" top=".4em" left="1em" onChange={color => handleChange({ color: color.target.value.toUpperCase() })
                                } />
                            </FormLabel>
                        </TabPanel>
                        <TabPanel>
                            <Property prop="width" index={brushes[4]} />
                            <MySlider defaultValue={5} value={"width"} callback={handleChange} />
                            <MyCheckbox w="7.5em" value="Erase Image" mt=".5em" onChange={e => myCanvas.current._objects[0].erasable = e.target.checked} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
}
