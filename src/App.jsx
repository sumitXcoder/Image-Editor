import { useState, useRef, useEffect, createContext, useContext } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pixelate, Blur, Vibrance, Noise, RemoveColor, Gamma, Convolute, Rotate, ImageFilters } from './Filters'
import { Box, Button, Input, FormLabel, HStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Tabs, TabList, Tab, TabPanels, TabPanel, Center, Flex } from "@chakra-ui/react"
import Adjust from './Adjust'
import Markup from './Markup'
import Text from './Text'
import Stickers from "./Stickers"
import Resize from "./Resize"
import Crop from "./Crop"
import _ from "lodash"

export const MyContext = createContext()
export const DPR = window.devicePixelRatio || 1
export const panelStyle = {
  backgroundColor: "var(--panel-bg)",
  color: "var(--color)",
  padding: ".75em .75em .25em .75em",
  backdropFilter: "blur(10px)",
  outline: "1px solid rgba(255,255,255,.4)",
  borderRadius: ".5em",
  boxShadow: "0 0 10px 1px rgba(25,25,25,.25)"
}
export const SliderContent = () => {
  return (
    <>
      <SliderTrack bg="var(--slider-track-color)" h="3px">
        <SliderFilledTrack bg="var(--slider-filled-track-color)" />
      </SliderTrack>
      <SliderThumb border="2px solid var(--slider-thumb-border-color)" bg="var(--slider-thumb-color)" width="max(12px,1em)" height="max(12px,1em)" />
    </>
  )
}


export var myCanvas, dataURL, canvasRef, wrapperRef, tabRef
const reader = new FileReader()
const filterClass = { blocksize: "Pixelate", rotation: "HueRotation" }
var file = ""
const tabs = [["Adjust", "sliders"], ["Markup", "pen"], ["Text", "text-height"], ["Pixelate", "table-cells"], ["Blur", "circle-dot"], ["Vibrance", "splotch"], ["Noise", "stroopwafel"], ["RemoveColor", "palette"], ["Gamma", "traffic-light"], ["Convolute", "wand-magic-sparkles"], ["Rotate", "rotate"], ["ImageFilters", "layer-group"], ["Stickers", "sticky-note"], ["Resize", "expand-arrows-alt"], ["Crop", "crop-alt"]]

function State(canvasProps, filters, imgProps, objects) {
  this.canvasProps = canvasProps
  this.filters = filters
  this.imgProps = imgProps
  this.objects = objects
}

const sideBar = {
  sx: {
    transitionDuration: ".1s",
    transitionDelay: "0s",
    zIndex: "2",
    border: "1px solid var(--outline-color-low)",
    borderRadius: "1.5em",
    backgroundColor: "var(--top-bg)",
    backdropFilter: "blur(10px)",
    overflow: "auto",
    boxShadow: "0 0 5px 0 rgba(10,10,10,.25)",
  },
  hover: {
    zIndex: "3",
    transitionDelay: ".9s",
    transitionDuration: ".3s",
    boxShadow: "0 0 10px 1px rgba(20,20,20,.25)"
  },
  vertical: {
    width: "3.25em",
    height: "min(650px,90vh)",
    overflow: "hidden auto"
  },
  horizontal: {
    overflow: "auto hidden",
    borderRadius: ".1em",
  }
}

const tabStyles = {
  sx: {
    color: "var(--color)",
    justifyContent: "flex-start",
  },
  selected: {
    boxShadow: "0 0 1px 1px lightblue",
    bg: "var(--active-tab-color)",
    borderRadius: ".25em"
  },
  hover: {
    transform: "scale(1.08)",
    boxShadow: "0 0 5px 0 rgba(25,25,25,.25)",
  }

}
export default function App({ theme, setTheme }) {
  const [filters, setFilters] = useState({})
  const [imgProps, setImgProps] = useState({ scaleX: 1, scaleY: 1 })
  const [currentTab, setCurrentTab] = useState(0)
  const [canvasProps, setCanvasProps] = useState({ width: 0, height: 0 })
  const history = useRef([[], []])
  const [medium, setMedium] = useState(false)
  const h = history.current
  const eventFlag = useRef(true)
  canvasRef = useRef(null)
  myCanvas = useRef(null)
  dataURL = useRef(null)
  wrapperRef = useRef(null)
  tabRef = useRef(0)
  
  useEffect(() => {
    console.clear()
    setMedium(window.innerWidth < 960)
    window.onresize = () => setMedium(window.innerWidth < 960)
    return () => window.onresize = null
  }, [])

  const readImage = e => {
    e.stopPropagation()
    let AVAILABLE_WIDTH = window.innerWidth - 10
    let AVAILABLE_HEIGHT = window.innerHeight - 150
    file = e.target.files[0]
    if (medium)
      AVAILABLE_HEIGHT -= 125
    if (file) {
      if (myCanvas.current)
        myCanvas.current.dispose()
      reader.readAsDataURL(file)
      reader.onload = () => {
        dataURL.current = reader.result
        fabric.Image.fromURL(dataURL.current, function (img) {
          if (AVAILABLE_WIDTH - 400 > img.width && !medium)
            AVAILABLE_WIDTH -= 400
          if (img.width * img.scaleX > AVAILABLE_WIDTH)
            img.scaleToWidth(AVAILABLE_WIDTH)
          if (img.height * img.scaleY > AVAILABLE_HEIGHT)
            img.scaleToHeight(AVAILABLE_HEIGHT)
          const width = img.width * img.scaleX
          const height = img.height * img.scaleY
          myCanvas.current = new fabric.Canvas(canvasRef.current, {
            width: width,
            height: height
          })
          img.erasable = false
          img.selectable = false
          img.hoverCursor = "default"
          myCanvas.current.add(img)
          setCanvasProps({ width: width, height: height })
          setImgProps({ scaleX: img.scaleX, scaleY: img.scaleY })
          h[0].push(new State({ width: width, height: height }, {}, { scaleX: img.scaleX, scaleY: img.scaleY }, { ...myCanvas.current._objects }))
          myCanvas.current.on("object:added", () => {
            if (eventFlag.current)
              addToHistory(null, null, null, [...myCanvas.current._objects])
          })
          myCanvas.current.on("object:removed", () => {
            if (eventFlag.current)
              addToHistory(null, null, null, [...myCanvas.current._objects])
          })
        })
      }
    }
  }

  const Save = e => {
    try {
      e.stopPropagation()
      const link = document.createElement("a")
      link.href = myCanvas.current.toDataURL(1.0)
      link.download = "Edited " + file.name + " on " + new Date().toLocaleString() + "." + file.type.slice(file.type.lastIndexOf('/') + 1)
      link.click()
    } catch (e) {
      if (e instanceof TypeError)
        window.alert("Upload an Image plz")
    }
  }

  const filterValue = value => {
    return value ? value > 0 ? "+" + Math.round(value * 100) + "%" : Math.round(value * 100) + "%" : 0 + "%"
  }
  const toFilterClass = string => {
    return filterClass.hasOwnProperty(string) ? filterClass[string] : string.replace(string[0], string[0].toUpperCase())
  }

  useEffect(() => {
    if (dataURL.current) {
      fabric.Image.fromURL(dataURL.current, function (img) {
        for (let key in filters) {
          if (filters[key] === "imageFilter") {
            img.filters.push(new fabric.Image.filters[key]())
          } else {
            let filter = {}
            typeof filters[key] === "object" ? filter = filters[key] : filter[key] = filters[key]
            img.filters.push(new fabric.Image.filters[toFilterClass(key)](filter))
          }
        }
        for (let prop in imgProps) {
          if (prop === "rotate")
            img.rotate(imgProps["rotate"])
          else
            img[prop] = imgProps[prop]
        }
        img.selectable = false
        img.erasable = false
        img.hoverCursor = "default"
        img.applyFilters()
        myCanvas.current._objects.shift()
        myCanvas.current._objects.unshift(img)
        myCanvas.current.renderAll()
      })
    }
  }, [filters, imgProps, dataURL.current, canvasProps])

  useEffect(() => {
    myCanvas.current?.setDimensions({ width: canvasProps.width, height: canvasProps.height })
  }, [canvasProps])

  const addToHistory = (c = null, f = null, i = null, objects = null) => {
    const index = h[0].length - 1
    h[1] = []
    c = { ...h[0][index].canvasProps, ...(c || h[0][index].canvasProps) }
    if (typeof f === "string") {
      const x = { ...h[0][index].filters }
      delete x[f]
      f = x
    } else {
      f = { ...h[0][index].filters, ...(f || h[0][index].filters) }
    }
    i = { ...h[0][index].imgProps, ...(i || h[0][index].imgProps) }
    objects = _.cloneDeep({ ...h[0][index].objects, ...(objects || h[0][index].objects) })
    h[0].push(new State(c, f, i, objects))
    console.log(...h[0])
  }

  const undo = () => {
    const length = h[0].length
    if (length > 1) {
      const u = h[0][length - 2]
      const popped = h[0].pop()
      h[1].push(popped)
      eventFlag.current = false
      myCanvas.current.clear()
      for (let obj of Object.values(u.objects))
        myCanvas.current.add(obj)
      eventFlag.current = true
      dataURL.current = u.objects[0]._element.src
      setFilters(u.filters)
      setImgProps(u.imgProps)
      setCanvasProps(u.canvasProps)
    }
  }

  const redo = () => {
    if (h[1].length > 0) {
      const popped = h[1].pop()
      h[0].push(popped)
      eventFlag.current = false
      myCanvas.current.clear()
      for (let obj of Object.values(popped.objects))
        myCanvas.current.add(obj)
      eventFlag.current = true
      dataURL.current = popped.objects[0]._element.src
      setFilters(popped.filters)
      setImgProps(popped.imgProps)
      setCanvasProps(popped.canvasProps)
    }
  }

  return (
    <MyContext.Provider value={{ filters, setFilters, filterValue, imgProps, setImgProps, currentTab, addToHistory, canvasProps, setCanvasProps, eventFlag, medium }}>
      <Box bg="var(--bg)" h="100dvh" w="100%" overflow="hidden" position="relative" margin="0" fontSize="clamp(12px,2vw,1em)">
        <Flex bg="var(--top-bg)" borderBottom="1px solid #666" justifyContent={medium ? "space-around" : "space-between"} alignItems="center" height="3.25em">{
          !medium &&
          <Box color="var(--color)" bg="var(--top-button-bg)" p=".6em" ml="1em"><FontAwesomeIcon icon="fa-camera" style={{ marginRight: ".5em" }} />PhotoShopper</Box>
        }
          {medium &&
            <>
              <FullScreen isMedium={medium} />
              <HStack >
                <Button size={medium ? "sm" : "md"} border="1px solid var(--outline-color-low)" borderRadius=".25em" bg="var(--top-button-bg)" color="var(--color)" aspectRatio="1/1" _hover={{ borderColor: "var(--outline-color)" }} onClick={undo}>
                  <FontAwesomeIcon icon="fa-rotate-left" />
                </Button>
                <Button size={medium ? "sm" : "md"} border="1px solid var(--outline-color-low)" borderRadius=".25em" bg="var(--top-button-bg)" color="var(--color)" aspectRatio="1/1" paddingBlock="2px" _hover={{ borderColor: "var(--outline-color)" }} onClick={redo}>
                  <FontAwesomeIcon icon="fa-rotate-right" />
                </Button>
              </HStack>
            </>}
          <HStack >
            <FormLabel w="max-content" bg="var(--top-button-bg)" p={medium ? ".25em .5em" : ".5em"} position="relative" top=".25em" borderRadius=".25em" textAlign="center" color="var(--color)" _hover={{ outline: "1px solid var(--top-button-hover)", cursor: "pointer" }}>
              <FontAwesomeIcon icon="fa-folder-open" style={{ marginRight: medium ? "0" : ".5em" }} />{medium ? "" : "Open"}
              <Input type="file" display="none" accept=".png ,.jpg, .jpeg,.webp" onChange={e => readImage(e)} />
            </FormLabel>
            <Button size={medium ? "sm" : "md"} onClick={e => Save(e)} w={medium ? "1em" : "max-content"} bg="var(--top-button-bg)" color="var(--color)" _hover={{ outline: "1px solid var(--top-button-hover)" }}><FontAwesomeIcon icon="fa-download" style={{ marginRight: medium ? "0" : ".5em" }} />{medium ? "" : "Save"}</Button>
          </HStack>
          <Button size={medium ? "sm" : "md"} color="var(--top-button-bg)" mr="1em" bg="var(--top-button-bg)" onClick={() => setTheme(t => !t)} _hover={{ outline: "1px solid var(--top-button-hover)" }}><FontAwesomeIcon icon={theme ? "fa-moon" : "fa-sun"} style={{ fontSize: "1.2em", color: theme ? "white" : "#ac9a46" }} /></Button>
        </Flex>
        <Box position="absolute" style={medium ? { top: "46%", left: "50%" } : { top: "50%", left: "60%" }} transform="translate(-50%,-50%)" p="0" zIndex="15" ref={wrapperRef} bg="var(--top-button-bg)" outline="1px dotted var(--color)">
          <canvas ref={canvasRef} style={{ zIndex: "0" }}></canvas>
        </Box>
        <Tabs orientation={medium ? "horizontal" : "vertical"} onChange={e => setCurrentTab(e)} w="100%" height="max-content" style={medium ? {} : { position: "relative", top: "45%", transform: "translateY(-50%)" }} ref={tabRef}>
          <Box position="relative" style={medium ? { bottom: "2px", width: "100%", marginTop: "2px" } : { width: "max-content", paddingLeft: ".25em" }} >
            <TabList style={medium ? { ...sideBar.sx, ...sideBar.horizontal } : { ...sideBar.sx, ...sideBar.vertical }} _hover={medium ? { ...sideBar.hover, width: "auto" } : sideBar.hover} >
              {tabs.map(tab => {
                return (
                  <Tooltip label={tab[0]} placement={medium ? "top" : "right"} hasArrow bg="var(--top-bg)" boxShadow="0 0 5px 1px rgba(25,25,25,.25)"
                    padding=".5em" color="var(--color)">
                    <Tab key={tab[0]} sx={medium ? { ...tabStyles.sx, padding: "1em", fontSize: ".95em" } : { ...tabStyles.sx, paddingBlock: ".7em" }} _selected={tabStyles.selected} _hover={tabStyles.hover}>
                      <FontAwesomeIcon icon={"fa-" + tab[1]} style={{ fontSize: "1.25em" }} />
                    </Tab>
                  </Tooltip>
                )
              })}
            </TabList>
          </Box>
          <TabPanels >
            <TabPanel style={medium ? { position: "absolute", bottom: "0", maxWidth: "100%", padding: "0", paddingBottom: ".5em" } : {}}><Adjust /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0", maxWidth: "100%", paddingInline: ".25em", zIndex: "0" } : {}} ><Markup /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Text /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Pixelate /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Blur /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Vibrance /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Noise /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><RemoveColor /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0", maxWidth: "100%" } : {}}><Gamma /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Convolute /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Rotate /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0", maxWidth: "100%" } : {}}><ImageFilters /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Stickers /></TabPanel>
            <TabPanel style={medium ? { position: "absolute", bottom: "0" } : {}}><Resize /></TabPanel>
            <TabPanel style={medium ? { zIndex: "20" } : {}}><Crop /></TabPanel>
          </TabPanels>
        </Tabs>
        {
          !medium &&
          <Flex justifyContent="space-between" alignItems="center" bg="var(--top-bg)" position="absolute" bottom="0" width="100%">
            <FullScreen isMedium={medium} />
            <Zoom />
            <HStack mr="5em">
              <Button border="1px solid var(--outline-color-low)" borderRadius=".25em" bg="var(--top-button-bg)" color="var(--color)" p="0" _hover={{ borderColor: "var(--outline-color)" }} onClick={undo}><FontAwesomeIcon icon="fa-rotate-left" /></Button>
              <Button border="1px solid var(--outline-color-low)" borderRadius=".25em" bg="var(--top-button-bg)" color="var(--color)" p="0" _hover={{ borderColor: "var(--outline-color)" }} onClick={redo}><FontAwesomeIcon icon="fa-rotate-right" /></Button>
            </HStack>
          </Flex>
        }
      </Box>
    </MyContext.Provider>
  )
}

const FullScreen = ({ isMedium }) => {
  const [isFullScreen, setIsFullScreen] = useState(null)
  useEffect(() => {
    if (isFullScreen === true)
      document.documentElement.requestFullscreen()
    else if (isFullScreen === false)
      document.exitFullscreen()
  }, [isFullScreen])
  return (
    <Button size={isMedium ? "sm" : "md"} border="1px solid var(--outline-color-low)" borderRadius=".25em" bg="var(--top-button-bg)" color="var(--color)" p="0"
      ml={isMedium ? ".1em" : "10em"} _hover={{ borderColor: "var(--outline-color)" }} onClick={() => setIsFullScreen(prev => !prev)}><FontAwesomeIcon icon={isFullScreen ? "fa-compress" : "fa-expand"} style={{ fontSize: "1em" }} />
    </Button>
  )
}

const Zoom = () => {
  var scale = 0
  const [sliderValue, setSliderValue] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const { imgProps } = useContext(MyContext)
  const _img = myCanvas.current?._objects[0]

  useEffect(() => {
    if (myCanvas.current) {
      scale = sliderValue / 100 + imgProps.scaleX
      _img.scaleX = scale
      _img.scaleY = scale
      myCanvas.current.centerObject(_img)
      myCanvas.current.renderAll()
    }
  }, [sliderValue])

  return (
    <Box bg="var(--top-bg)" paddingBlock=".75em" width="25%">
      <HStack >
        <Center color="var(--color)" width="1em" height="1em" p=".6em" border="1px solid var(--outline-color-low)" fontSize="1.5em" borderRadius="50%">-</Center>
        <Slider id='slider' defaultValue={0} min={-200} max={200} onChange={(v) => setSliderValue(v)} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} marginInline="1em" >
          <SliderTrack bg="var(--slider-track-color)" h="3px">
            <SliderFilledTrack bg="var(--slider-filled-track-color)" />
          </SliderTrack>
          <Tooltip hasArrow bg='blue.400' color='white' placement='top' isOpen={showTooltip} label={`${sliderValue}%`}
          >
            <SliderThumb border="2px solid var(--slider-thumb-border-color)" bg="var(--slider-thumb-color)" width="1.2em" height="1.2em" />
          </Tooltip>
        </Slider>
        <Center color="var(--color)" width="1em" height="1em" p=".6em" border="1px solid var(--outline-color-low)"
          fontSize="1.5em" borderRadius="50%">+</Center>
      </HStack>
    </Box>
  )
}