import { useEffect, useState } from 'react';
import { Prospect } from 'utils/interfaces';
import { umamiTrack } from 'utils/umami';
import { updateProspect } from 'features/database/renderer';
import DataTable from '@semcore/ui/data-table';
import LinkExternal from '../../../../assets/svgs/LinkExternal';
import TrashM from '@semcore/ui/icon/Trash/m';
import CheckM from '@semcore/ui/icon/Check/m';
import Button from '@semcore/ui/button';
import { Text } from '@semcore/ui/typography';
import Checkbox from '@semcore/ui/checkbox';
import AddNewProspectDialog from '../Prospects/Dialogs/AddNewProspect';
import DeleteProspectDialog from '../Prospects/Dialogs/DeleteProspects';
import useProspects from 'hooks/useProspects';
import { numberWithCommas } from 'utils/utils';

const InProgress = () => {
  const { prospects } = useProspects(
    { state: 'in-progress' },
    'updated-in-progress'
  );
  const { prospects: earnedProspects } = useProspects(
    { state: 'earned' },
    'updated-earned'
  );

  const [currentProspects, setcurrentProspects] = useState(prospects);
  const [checks, setChecks] = useState<Array<string>>([]);

  const [sc, setSc] = useState(0);

  // Add new entry to database
  const [sourceDomain, setSourceDomain] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [as, setAs] = useState(0);
  const [_id, set_id] = useState('');
  const [prospect, setProspect] = useState<Prospect>({} as Prospect);

  useEffect(() => {
    setcurrentProspects(sc == 0 ? prospects : earnedProspects);
    console.log('earned', earnedProspects);
  }, [sc, prospects, earnedProspects]);

  useEffect(() => {
    umamiTrack({ url: '/link-building/in-progress' });
  }, []);

  const all = (checked: boolean) => {
    if (checked) {
      //@ts-ignore
      setChecks(currentProspects.map((el) => el._id));
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

      <h2 className="font-bold text-xl pt-4">Domain in Progress</h2>

      <div className="flex gap-x-3">
        <button
          onClick={() => setSc(0)}
          className={`card card-compact w-48 ${
            sc == 0 ? 'bg-[#C2DCF7] border border-blue-400' : 'bg-base-100'
          } shadow-xl my-4 transition-all delay-200 ease-linear`}
        >
          <div className="card-body">
            <p className="text-sm">Prospects to contact</p>
            <h2 className="card-title font-extrabold">
              {numberWithCommas(prospects.length)}
            </h2>
          </div>
        </button>

        <button
          onClick={() => setSc(1)}
          className={`card card-compact w-48 ${
            sc == 1 ? 'bg-[#C2DCF7] border border-blue-400' : 'bg-base-100'
          } shadow-xl my-4 transition-all delay-200 ease-linear`}
        >
          <div className="card-body">
            <p className="text-sm">Earned Backlinks</p>
            <h2 className="card-title font-extrabold text-green-700">
              {numberWithCommas(earnedProspects.length)}
            </h2>
          </div>
        </button>
      </div>

      {currentProspects.length == 0 ? (
        <p>There is nothing here</p>
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
                console.log('row', row);
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
              {(_, row: Prospect) => {
                return {
                  children: (
                    <div className="flex items-center gap-2 p-4 ml-auto">
                      <Button
                        size="m"
                        use="secondary"
                        onClick={() => {
                          window.electron.ipcRenderer.sendMessage(
                            'update-prospect',
                            {
                              _id: row._id,
                              set: { state: 'earned' },
                            },
                            ['updated-earned', 'updated-in-progress']
                          );
                        }}
                      >
                        <Button.Addon>
                          <CheckM />
                        </Button.Addon>
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
  );
};

export default InProgress;
