import { updateProspect } from 'features/database/renderer';
import { useEffect, useState } from 'react';
import { Prospect } from 'utils/interfaces';
import AddNewProspectDialog from './Dialogs/AddNewProspect';
import DeleteProspectDialog from './Dialogs/DeleteProspects';
import DataTable from '@semcore/ui/data-table';
import LinkExternal from '../../../../assets/svgs/LinkExternal';
import TrashM from '@semcore/ui/icon/Trash/m';
import Button from '@semcore/ui/button';
import { Text } from '@semcore/ui/typography';
import Checkbox from '@semcore/ui/checkbox';
import { umamiTrack } from 'utils/umami';
import useProspects from 'hooks/useProspects';
import { numberWithCommas } from 'utils/utils';

const Prospects = () => {
  const [sc, setSc] = useState(0);
  const { prospects } = useProspects(
    { state: 'prospect' },
    'updated-prospects'
  );
  const { prospects: rejectedProspects } = useProspects(
    { state: 'rejected' },
    'updated-rejected'
  );
  const [currentProspects, setcurrentProspects] = useState(prospects);

  useEffect(() => {
    setcurrentProspects(sc == 0 ? prospects : rejectedProspects);
  }, [sc, prospects, rejectedProspects]);

  // Add new entry to database
  const [sourceDomain, setSourceDomain] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [as, setAs] = useState(0);
  const [_id, set_id] = useState('');
  const [prospect, setProspect] = useState<Prospect>({} as Prospect);
  const [checks, setChecks] = useState<Array<string>>([]);

  useEffect(() => {
    umamiTrack({ url: '/link-building/prospects' });
  }, []);

  const all = (checked: boolean) => {
    if (checked) {
      //@ts-ignore
      setChecks(prospects.map((el) => el._id));
    } else {
      setChecks([]);
    }
  };

  const item = (_: any, e: any) => {
    const { id } = e.currentTarget;

    if (checks.includes(id)) {
      checks.splice(checks.indexOf(id), 1);
    } else {
      checks.push(id);
    }
    setChecks([...checks]);
  };

  const isInCheck = (_id: string) => {
    return checks.includes(_id);
  };

  return (
    <div>
      <AddNewProspectDialog />
      <DeleteProspectDialog prospect={prospect} />

      <h2 className="font-bold text-xl pt-2">Domain Prospects</h2>
      <div className="flex gap-x-3">
        <button
          onClick={() => setSc(0)}
          className={`card card-compact w-36 ${
            sc == 0 ? 'bg-[#C2DCF7] border border-blue-400' : 'bg-base-100'
          } shadow-xl my-4 transition-all delay-200 ease-linear`}
        >
          <div className="card-body">
            <p className="text-sm">All Prospects</p>
            <h2 className="card-title font-extrabold">
              {numberWithCommas(prospects.length)}
            </h2>
          </div>
        </button>

        <button
          onClick={() => setSc(1)}
          className={`card card-compact w-36 ${
            sc == 1 ? 'bg-[#C2DCF7] border border-blue-400' : 'bg-base-100'
          } shadow-xl my-4 transition-all delay-200 ease-linear`}
        >
          <div className="card-body">
            <p className="text-sm">Rejected</p>
            <h2 className="card-title font-extrabold">
              {numberWithCommas(rejectedProspects.length)}
            </h2>
          </div>
        </button>
      </div>

      <div>
        {currentProspects.length == 0 ? (
          <div className="text-center">
            <p className="text-gray-500 text-center py-4">
              There is nothing here! You can:
            </p>
            <Button
              size="l"
              theme="success"
              use="primary"
              onClick={() => {
                //@ts-ignore
                window.add_new_prospect_modal.showModal();
              }}
            >
              Add new prospect
            </Button>
          </div>
        ) : (
          <DataTable
            data={currentProspects}
            className="border-2 border-gray-200 rounded-md"
          >
            <DataTable.Head>
              <DataTable.Column name="sourceDomain">
                <div className="flex">
                  <div className="mr-3 ml-4">
                    <Checkbox size="l" state="normal">
                      <Checkbox.Value onChange={all} />
                      <Checkbox.Text></Checkbox.Text>
                    </Checkbox>
                  </div>
                  <div className="flex flex-col">
                    <Text>Source Domain, URL Example and Snippet</Text>
                    <Text color="gray60">
                      1-{Math.min(100, currentProspects.length)} of{' '}
                      {currentProspects.length} domains
                    </Text>
                  </div>
                </div>
              </DataTable.Column>
              <DataTable.Column name="as" children="AS" wMax={60} />
              <DataTable.Column name="actions" wMax={250}>
                <div className="flex flex-col ml-auto pr-4">
                  <Text>Actions</Text>
                </div>
              </DataTable.Column>
            </DataTable.Head>
            <DataTable.Body>
              <DataTable.Cell<typeof prospects> name="sourceDomain">
                {(_, row) => {
                  return {
                    children: (
                      <td className="font-normal p-4 flex">
                        <div className="mr-3">
                          <Checkbox size="l" state="normal">
                            <Checkbox.Value
                              id={row._id}
                              checked={isInCheck(row._id)}
                              onChange={item}
                            />
                            <Checkbox.Text></Checkbox.Text>
                          </Checkbox>
                        </div>

                        <div>
                          <div className="font-bold">{row.sourceDomain}</div>
                          <div
                            className="flex gap-2 cursor-pointer hover:underline w-max"
                            onClick={() => {
                              console.log('open external');
                              window.electron.ipcRenderer.sendMessage(
                                'open-external',
                                {
                                  url: row.url,
                                }
                              );
                            }}
                          >
                            <p>{row.url}</p>
                            <div>
                              <LinkExternal url={row.url} />
                            </div>
                          </div>
                          <div className="text-gray-400">{row.notes}</div>
                        </div>
                      </td>
                    ),
                  };
                }}
              </DataTable.Cell>
              <DataTable.Cell<typeof prospects> name="actions">
                {(_, row) => {
                  return {
                    children: (
                      <div className="flex items-center gap-2 p-4 ml-auto">
                        <Button
                          size="m"
                          use="primary"
                          onClick={() => {
                            //              updateProspect(row._id, { state: 'in-progress' });

                            window.electron.ipcRenderer.sendMessage(
                              'update-prospect',
                              {
                                _id: row._id,
                                set: { state: 'in-progress' },
                              },
                              ['updated-prospects']
                            );
                          }}
                        >
                          To In Progress
                        </Button>
                        <Button
                          size="m"
                          use="secondary"
                          onClick={() => {
                            setSourceDomain(row.sourceDomain);
                            setUrl(row.url);
                            setNotes(row.notes);
                            setAs(Number(row.as));
                            set_id(row._id);
                            setProspect({
                              sourceDomain: row.sourceDomain,
                              url: row.url,
                              notes: row.notes,
                              as: row.as,
                              _id: row._id,
                            });
                            //@ts-ignore
                            window.delete_prospect_modal.showModal();
                          }}
                        >
                          <Button.Addon>
                            <TrashM />
                          </Button.Addon>
                        </Button>
                      </div>
                    ),
                  };
                }}
              </DataTable.Cell>
            </DataTable.Body>
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default Prospects;
