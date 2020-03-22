import React, {useState, useEffect} from 'react'
import axios from 'axios'

import './App.css'
import TableData from "./TableData";
import HeaderData from "./HeaderData";
import { Container } from 'semantic-ui-react';

const App = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
          const res = await axios('http://starlord.hackerearth.com/bankAccount')
          setData(res)
        }
        getData()
    }, [])

    return (<Container style={{margin: '100px'}}>
      <HeaderData />
      <TableData data={data} />
    </Container>)
    
}

export default App;
