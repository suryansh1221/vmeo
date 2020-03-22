import React, {useState, useEffect} from 'react'
import _ from "lodash";
import { Icon, Label, Menu, Table, Header, Pagination, Search, Container, Button, Grid, Dropdown } from 'semantic-ui-react'

const TableData = (props) => {

    const data = props.data.data
    const parsedTableData = []
    const headers = []
    const dropdownOptions = [
      {key:'Date',text:'Date',value:'Date'},
      {key:'Transaction Details',text:'Transaction Details',value:'Transaction Details'},
      {key:'Deposit AMT',text:'Deposit AMT',value:'Deposit AMT'},
      {key:'Balance AMT',text:'Balance AMT',value:'Balance AMT'}
    ]
    const [activePage, setActivePage] = useState(1);
    const [direction, setDirection] = useState('ascending');
    const [data1, setData1] = useState(parsedTableData);
    const [copy, setCopy] = useState(parsedTableData);
    const [column, setColumn] = useState(null);
    const [headers1, setHeaders1] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [value, setValue] = useState([]);
    const [selectedValue, setSelectedValue] = useState('Filter');

    useEffect(() => {
      for(var key in data)parsedTableData.push(data[key])
      for(var key in parsedTableData[0])headers.push(key)
      setData1(parsedTableData)
      setCopy(parsedTableData)
      setHeaders1(headers)
    }, [props])
   
    const parseHeader = () => {
      return headers1.map((ele) => {
          return <Table.HeaderCell sorted={column===ele?direction:null} onClick={handleSort(ele)}>{ele}</Table.HeaderCell>
      })
    }
    
    const parseRow = (ele) => {
      return headers1.map((col) => {
        return <Table.Cell>{ele[col]}</Table.Cell>
      })
    }

    const parseTable = () => {
      return data1.map((ele, index) => {
        index+=1
        if(index >= activePage*10-10+1 && index <= activePage*10)
        {
          const tt = parseRow(ele)
          return <Table.Row>{tt}</Table.Row>
        }
      })
    }

    const onChange = (e, pageInfo) => {
      setActivePage(pageInfo.activePage);
    };

    const handleSort = (clickedColumn) => () => {
      if (column !== clickedColumn) {
        setColumn(clickedColumn)
        setData1( _.sortBy(data1, [clickedColumn]))
        setDirection('ascending')     
        return
      }
      setData1(data1.reverse())
      setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    }

    const handleSearchChange = (e, { value }) => {
      if(value < 1)setResults(copy)
      setLoading(true)
      setValue(value)
      setData1(copy)
      setResults(copy)
      console.log(selectedValue)
      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => {return re.test(result[selectedValue])}
      setLoading(false)
      const rr = _.filter(data1, isMatch)
      setResults(rr)
      console.log(results)
    }

    const searchData = () => {
      console.log(results)
        setData1(results)
    }

    const clickDropdown = (e, data) => {
      setSelectedValue(data.value)
    }

    return(
      <Grid>
      
      <Search 
        fluid 
        loading={loading}
        value={value}
        showNoResults={false}
        onSearchChange={_.debounce(handleSearchChange, 100, {
          leading: true,
        })}
        />
        <Button primary onClick={searchData}>
          search
        </Button>
        <Dropdown
          text={selectedValue}
          icon='filter'
          floating
          labeled
          button
          className='icon'
          options={dropdownOptions}
          onChange={clickDropdown}
        ></Dropdown>
        <Table celled compact sortable>
        <Table.Header>
          <Table.Row>
          {parseHeader()}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {parseTable()}
        </Table.Body>

      </Table>
      <Container textAlign='right'>
          <Pagination 
            totalPages={20} 
            activePage={activePage} 
            onPageChange={onChange}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }} 
          />
      </Container>
      </Grid>
    )
}

export default TableData;
