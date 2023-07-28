import { addProspect } from 'features/database/renderer';
import Button from '@semcore/ui/button';
import { useState } from 'react';

const AddNewProspectDialog = () => {
  // Add new entry to database
  const [sourceDomain, setSourceDomain] = useState('');
  const [url, setUrl] = useState('https://');
  const [notes, setNotes] = useState('');
  const [as, setAs] = useState(0);
  const [_id, set_id] = useState('');

  const setUrlHttps = (url: string) => {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = 'https://' + url;
    }
    setUrl(url);
  };

  return (
    <dialog id="add_new_prospect_modal" className="modal">
      <form method="dialog" className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg mb-6">Add new prospect</h3>
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Source domain</span>
            </label>
            <input
              type="text"
              placeholder="Source domain"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setSourceDomain(e.target.value)}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">URL</span>
            </label>
            <input
              type="text"
              placeholder="URL"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setUrlHttps(e.target.value)}
              value={url}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <input
              type="text"
              placeholder="Notes"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Authority Score</span>
            </label>
            <input
              type="number"
              max={100}
              min={0}
              placeholder="Authority Score"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setAs(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="w-full text-right mt-8 flex gap-4">
          <button
            onClick={() => {
              // todo: make "add-prospect"
              window.electron.ipcRenderer.sendMessage(
                'add-prospect',
                { sourceDomain, url, notes, as, state: 'prospect' },
                ['updated-prospects']
              );
            }}
          >
            <Button size="l" theme="success" use="primary">
              Add new prospect
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

export default AddNewProspectDialog;
