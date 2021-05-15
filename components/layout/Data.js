import React from 'react';
import { Chart } from "react-google-charts";
import Axios from 'axios';
import { Grid, Header, Loader, Item, Message, Radio } from 'semantic-ui-react';
import RapidApi from '../../config/RapidApi';
import { DateTime } from 'luxon';
import { AgGridReact } from 'ag-grid-react';
import rapidHeaders from '../../config/RapidApiHeaders';

  export default class DataComp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: {},
        totalData: [
          [ "Country", "Total Cases", "Active Cases"]
        ],
        worldData: '',
        lastDate: '',
        toggle: true,

        totalRawData: [],
        columnDefs: [
          { headerName: 'Country', field: 'countries', width: 300 },
          {
            headerName: 'Total Cases', field: 'totalCases', width: 250,
          },
          {
            headerName: 'Active Cases', field: 'activeCases', width: 300,
          },
          {
            headerName: 'Total Deaths', field: 'totalDeaths', width: 320,
          },
          {
            headerName: 'Total Recovered', field: 'totalRecovered', width: 300,
          },
          // { name: 'Actions', field: 'actions', cellRenderer: 'iconRenderer' },
        ],
        defaultColDef: {
          sortable: true,
          filter: true,
          autoHeight: true,
        },
        overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
        overlayNoRowsTemplate:
          '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Loading</span>',
      };
    }
  
    componentDidMount() {
      const { totalData } = this.state;
      const headers = rapidHeaders();
      Axios.get(RapidApi.totalData, { headers }).then(({data}) => {
        const totalRawData = data;
        const tempData = data;
        const lastDate = tempData.pop();
        let temp = tempData;
        const onlyWorldData = temp.shift();
        const onlyUSA = temp.filter(item => item.Country_text === 'USA');
        //shift is for removing US from list because of chart issue
        temp.shift();

        //pop is for removing last update coming in array
        temp.pop();
        totalRawData.push(onlyUSA);
        const countries = temp.map((item) => ([item.Country_text, item["Total Cases_text"] ? parseFloat(item["Total Cases_text"].replace(/,/g,"")) : 0, item["Active Cases_text"] ? parseFloat(item["Active Cases_text"].replace(/,/g,"")) : 0 ]));

        countries.push(['United States', onlyUSA[0]["Total Cases_text"] ? parseFloat(onlyUSA[0]["Total Cases_text"].replace(/,/g,"")) : 0,  onlyUSA[0]["Active Cases_text"] ? parseFloat(onlyUSA[0]["Active Cases_text"].replace(/,/g,"")) : 0 ]);
        this.setState({ totalData: [...totalData, ...countries], data, worldData: onlyWorldData, lastDate, totalRawData });
      })
    }

    renderRowData = () => {
      const { totalRawData } = this.state;
      return totalRawData.map((con) => ({
        countries: con['Country_text'],
        totalCases: con['Total Cases_text'],
        activeCases: con['Active Cases_text'],
        totalDeaths: con['Total Deaths_text'],
        totalRecovered: con['Total Recovered_text'],
      }));
    }

    onToggleClick = () => {
      const { toggle } = this.state;
      this.setState({
        toggle: !toggle,
      });
    }

    render() {
      const {
        totalData, data, worldData, lastDate, toggle, columnDefs, defaultColDef, components,
        frameworkComponents, overlayNoRowsTemplate, overlayLoadingTemplate,
       } = this.state;
      return (
        <div>
          {
            Object.keys(data).length ?
            
          <Grid>
            <Grid.Row>
              <Grid.Column textAlign="center" width={4} verticalAlign="middle">
          <Message info >
                <Header>Total Cases:&nbsp;{worldData['Total Cases_text']}</Header>
                </Message>
              </Grid.Column>
              <Grid.Column textAlign="center" width={4} verticalAlign="middle">
          <Message info >
                <Header>Total Active Cases:&nbsp;{worldData['Active Cases_text']}</Header>
                </Message>
              </Grid.Column>
              <Grid.Column textAlign="center" width={4} verticalAlign="middle">
          <Message info >
                <Header>Total Deaths:&nbsp;{worldData['Total Deaths_text']}</Header>
                </Message>
              </Grid.Column>
              <Grid.Column textAlign="center" width={4} verticalAlign="middle">
          <Message info >
                <Header>Total Recovered:&nbsp;{worldData['Total Recovered_text']}</Header>
                </Message>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column />
              <Grid.Column textAlign="center">
              <Item>

<Item.Extra>Last Updated:&nbsp;{lastDate['Last Update']}</Item.Extra>
</Item>
</Grid.Column>
<Grid.Column textAlign="right" >
<div className="divAlignCenter" style={{  display: 'flex', flexDirection: 'row-reverse' }}>
                    <p style={!toggle ? {
                      display: 'inline', fontSize: 'large', marginLeft: 10, marginRight: 10, color: '#317dc8', fontWeight: 'bold',
                    } : {
                      display: 'inline', fontSize: 'large', marginLeft: 10, marginRight: 10, fontWeight: 'bold', color: '#666',
                    }}
                    >
                      List
                    </p>
                    <span style={{ display: 'inline', marginLeft: 10, marginRight: 10 }}><Radio toggle style={{ backgroundColor: '#317dc8', borderRadius: '50px' }} onClick={this.onToggleClick} /></span>
                    <p style={!toggle ? {
                      display: 'inline', fontSize: 'large', marginLeft: 10, marginRight: 10, fontWeight: 'bold', color: '#666',
                    } : {
                      display: 'inline', fontSize: 'large', marginLeft: 10, marginRight: 10, color: '#317dc8', fontWeight: 'bold',
                    }}
                    >
                      Map
                    </p>
                  </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column verticalAlign="middle">
                {
                  toggle
                  ?
            <Chart
          chartEvents={[
            {
              eventName: "select",
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 0) return;
                const region = totalData[selection[0].row + 1];
              }
            }
          ]}
          chartType="GeoChart"
          width="auto"
          height="450px"
          data={totalData}
          options={{
            colorAxis: { colors: ['#fff', '#e31b23'] },
          }}
        />
        :
        <div className="ag-theme-alpine" style={{ height: '540px', width: '100%' }}>
                <AgGridReact
                  enableCellTextSelection
                  columnDefs={columnDefs}
                  rowData={this.renderRowData()}
                  defaultColDef={defaultColDef}
                  frameworkComponents={frameworkComponents}
                  getRowHeight={100}
                  pagination
                  paginationPageSize={10}
                  overlayLoadingTemplate={overlayLoadingTemplate}
                  overlayNoRowsTemplate={overlayNoRowsTemplate}
                />
              </div>
    }
              </Grid.Column>
            </Grid.Row>
          </Grid>
          :
          <Grid centered>
          <Grid.Row>
            <Grid.Column>
                    <Loader active inline="centered" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
    }
        </div>
      );
    }
  }
  
  