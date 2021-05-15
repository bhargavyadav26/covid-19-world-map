import { Divider } from 'semantic-ui-react';
import Data from './Data';

export default function Home(props) {
  return (
<div>
      <div>
        <h1 className="title">
          Covid-19 Cases Info 
        </h1>
      </div>
      <Divider />
        <Data />
      </div>
  )
}
