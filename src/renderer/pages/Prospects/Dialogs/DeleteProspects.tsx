import { Text } from '@semcore/ui/typography';
import { updateProspect } from 'features/database/renderer';
import Button from '@semcore/ui/button';

const DeleteProspectDialog = ({ prospect }: any) => {
  return (
    <dialog id="delete_prospect_modal" className="modal">
      <form method="dialog" className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg mb-6">Delete prospect</h3>
        <div className="my-4">
          <Text>Are you sure you want to delete this prospect?</Text>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="card w-96 bg-neutral text-neutral-content">
            <div className="card-body text-left">
              <div>
                <p className="text-gray-400">Source domain:</p>
                <p>{prospect.sourceDomain}</p>
              </div>
              <div>
                <p className="text-gray-400">URL:</p>
                <p>{prospect.url}</p>
              </div>
              {prospect.notes == '' ? null : (
                <div>
                  <p className="text-gray-400">Notes:</p>
                  <p>{prospect.notes}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400">AS:</p>
                <p>{prospect.as}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full text-right mt-8 flex gap-4">
          <button
            onClick={() => {
              //updateProspect(prospect._id, { state: 'rejected' }, '1');
              window.electron.ipcRenderer.sendMessage(
                'update-prospect',
                {
                  _id: prospect._id,
                  set: { state: 'rejected' },
                },
                [
                  'updated-prospects',
                  'updated-rejected',
                  'updated-in-progress',
                  'updated-earned',
                ]
                //['updated-prospects', 'updated-rejected']
              );
            }}
          >
            <Button size="l" theme="danger" use="primary">
              Delete prospect
            </Button>
          </button>
          <button>
            <Button size="l" use="secondary">
              Cancel
            </Button>
          </button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DeleteProspectDialog;
