import React from 'react';
import { Chart } from "react-google-charts";
import Axios from 'axios';
import { Grid, Header, Loader, Item, Message } from 'semantic-ui-react';
import RapidApi from '../../config/RapidApi';
import { DateTime } from 'luxon';
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
      };
    }
  
    componentDidMount() {
      const { totalData } = this.state;
      const headers = rapidHeaders();
      Axios.get(RapidApi.totalData, { headers }).then(({data}) => {
        const lastDate = data.pop();
        let temp = data;
        const world = temp.shift();
        const onlyUSA = temp.filter(item => item.Country_text === 'USA');
        //shift is for removing US from list because of chart issue
        temp.shift();

        //pop is for removing last update coming in array
        temp.pop();

        const countries = temp.map((item) => ([item.Country_text, item["Total Cases_text"] ? parseFloat(item["Total Cases_text"].replace(/,/g,"")) : 0, item["Active Cases_text"] ? parseFloat(item["Active Cases_text"].replace(/,/g,"")) : 0 ]));

        countries.push(['United States', onlyUSA[0]["Total Cases_text"] ? parseFloat(onlyUSA[0]["Total Cases_text"].replace(/,/g,"")) : 0,  onlyUSA[0]["Active Cases_text"] ? parseFloat(onlyUSA[0]["Active Cases_text"].replace(/,/g,"")) : 0 ]);
        this.setState({ totalData: [...totalData, ...countries], data, worldData: world, lastDate });
      })
    }

    render() {
      const { totalData, data, worldData, lastDate } = this.state;
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
            <Grid.Row style={{padding: 0}}>
              <Grid.Column textAlign="center">
              <Item>

<Item.Extra>Last Updated:&nbsp;{lastDate['Last Update']}</Item.Extra>
</Item>
            
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column verticalAlign="middle">
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
           // region: '002', // Africa
            colorAxis: { colors: ['#fff', '#e31b23'] },
            // backgroundColor: '#81d4fa',
            // datalessRegionColor: '#f8bbd0',
            // defaultColor: '#f5f5f5',
          }}
        />
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
  
  