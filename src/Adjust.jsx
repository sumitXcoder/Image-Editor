import React, { useContext } from "react"
import { Box, Text, Slider, Flex } from "@chakra-ui/react"
import { MyContext, panelStyle, SliderContent } from './App'

const styles = {
  large: {
    width: "15em",
    flexFlow: "column"
  },
  medium: {
    fontSize: ".5em",
    width: "auto",
    flexFlow: "row",
    columnGap: "1em",
    padding: ".25em .5em"
  }
}
export const Property = ({ prop, value }) => {
  const { medium } = useContext(MyContext)
  return (
    <Flex justifyContent="space-between" fontSize="clamp(14px,2vw,1em)" width={medium ? "150px" : "100%"}>
      <Text fontWeight="300" letterSpacing="1px" fontSize="1em">{prop.replace(prop[0], prop[0].toUpperCase())}</Text>
      <Box border="1px solid var(--outline-color-low)" padding="0px 5px" borderRadius=".25em">{value}
      </Box>
    </Flex>
  )
}
export default function Adjust() {
  const { filters, setFilters, filterValue, addToHistory, medium } = useContext(MyContext)
  return (
    <Flex sx={medium ? { ...panelStyle, ...styles.medium } : { ...panelStyle, ...styles.large }} overflowX="auto">{
      ["brightness", "contrast", "saturation", "rotation"].map(filter => {
        return (
          <Box key={filter}>
            <Property prop={filter} value={filterValue(filters[filter])} />
            <Slider defaultValue={0} min={-100} max={100} onChangeEnd={value => {
              setFilters({ ...filters, [filter]: value / 100 })
              addToHistory(null, { [filter]: value / 100 }, null, null)
            }}>
              <SliderContent />
            </Slider>
          </Box >
        )
      })}
    </Flex>
  )
}