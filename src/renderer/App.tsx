import { useState } from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import Button from '@semcore/ui/button';
import TabLine from '@semcore/ui/tab-line';
import Prospects from './pages/Prospects';
import SideBar from './pages/SideBar';
import InProgress from './pages/InProgress';

function Hello() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div>
        <div className="bg-[#121417] h-10 w-full">
          <p className="text-white text-2xl">logo here</p>
        </div>
        <div className="flex bg-[#F2F3F8]">
          <SideBar />
          <div className="w-full p-8 border-l border-l-gray-300 ">
            <div className="flex justify-between mt-4 mx-4">
              <div>
                <TabLine size="l" underlined value={tab} onChange={setTab}>
                  <TabLine.Item value={0}>Prospects</TabLine.Item>
                  <TabLine.Item value={1}>In Progress</TabLine.Item>
                </TabLine>
              </div>

              {/* Show 'Add new prospect' if we are on 'Prospects tab' */}
              {tab == 0 ? (
                <Button
                  size="l"
                  theme="success"
                  use="primary"
                  className="!mb-2"
                  onClick={() => {
                    //@ts-ignore
                    window.add_new_prospect_modal.showModal();
                  }}
                >
                  Add new prospect
                </Button>
              ) : null}
            </div>
            {tab == 0 ? <Prospects /> : tab == 1 ? <InProgress /> : null}
          </div>
        </div>
      </div>
      )
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
