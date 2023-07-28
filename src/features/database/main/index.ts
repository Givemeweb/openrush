import { ipcMain, shell } from 'electron';
import Datastore from '@seald-io/nedb';
import Nedb from '@seald-io/nedb';
import { ListenChannels } from 'main/preload';
import path from 'path';

//
// Database
//
const db: { [index: string]: Nedb<Record<string, any>> } = {};

db.linkBuildingTool = new Datastore({
  filename:
    process.env.NODE_ENV == 'development'
      ? path.join(__dirname, 'link-building-tool.db')
      : process.resourcesPath + '/db/link-building-tool.db',
  autoload: true,
});

//
// ipcMain listeners
//

ipcMain.on('add-prospect', async (event, prospect: {}, replyChannel) => {
  console.log('add-prospect', prospect, replyChannel);
  const res = await db.linkBuildingTool.insertAsync(prospect);
  console.log(res);

  // get prospects and send it to renderer
  const docs = await db.linkBuildingTool
    .findAsync({ state: 'prospect' })
    .limit(100);

  console.log('sending', replyChannel);
  if (typeof replyChannel == 'string') {
    event.reply(replyChannel, { prospects: docs });
  } else {
    for (let channel of replyChannel) {
      event.reply(channel, { prospects: docs });
    }
  }
});

ipcMain.on('get-prospects', async (event, query: {}, replyChannel) => {
  console.log('get-prospects', query, replyChannel);
  // get prospects and send it to renderer
  const docs = await db.linkBuildingTool.findAsync(query).limit(100);

  if (typeof replyChannel == 'string') {
    event.reply(replyChannel, { prospects: docs });
  } else {
    for (let channel of replyChannel) {
      event.reply(channel, { prospects: docs });
    }
  }
});

ipcMain.on(
  'update-prospect',
  async (
    event,
    arg: { _id: string; set: {} },
    replyChannel: Array<ListenChannels>
  ) => {
    console.log('update-prospect', arg, replyChannel);
    await db.linkBuildingTool.updateAsync({ _id: arg._id }, { $set: arg.set });

    let docs;
    for (let channel of replyChannel) {
      if (channel == 'updated-prospects') {
        docs = await db.linkBuildingTool
          .findAsync({ state: 'prospect' })
          .limit(100);
      } else if (channel == 'updated-rejected') {
        docs = await db.linkBuildingTool
          .findAsync({ state: 'rejected' })
          .limit(100);
      } else if (channel == 'updated-in-progress') {
        docs = await db.linkBuildingTool
          .findAsync({ state: 'in-progress' })
          .limit(100);
      } else if (channel == 'updated-earned') {
        docs = await db.linkBuildingTool
          .findAsync({ state: 'earned' })
          .limit(100);
      }
      event.reply(channel, { prospects: docs });
    }
  }
);

///
//
//
//
//
ipcMain.on(
  'lbt-prospects-get',
  async (event, arg: { query: {}; limit: number }) => {
    try {
      console.log('');
      console.log('');
      console.log('--- [ lbt-prospects-get ] ---');
      console.log('query:', arg.query);

      const docs = await db.linkBuildingTool
        .findAsync(arg.query)
        .limit(arg.limit);

      console.log('');
      console.log('docs HEAD(2):', docs.slice(0, 2));
      console.log('');
      console.log('sending docs to', 'lbt-prospects-get-response');
      event.reply('lbt-prospects-get-response', { prospects: docs });
      console.log('-----------------------------');
    } catch (error) {}
  }
);

async function getProspects(event, channel, arg) {
  try {
    console.log(`\nget-prospects`, arg);
    const docs = await db.linkBuildingTool
      .findAsync(arg.query)
      .limit(arg.limit);
    console.log(docs.slice(0, 2));
    console.log('Sending to', `"${channel}"`);
    event.reply(channel, {
      prospects: docs,
    });
  } catch (error) {}
}
ipcMain.on('get-prospectsa', async (event, channel, arg) => {
  getProspects(event, channel, arg);
});

ipcMain.on('update-prospecta', async (event, channel, arg) => {
  try {
    console.log('update-prospect', arg);

    const res = await db.linkBuildingTool.updateAsync(
      { _id: arg._id },
      { $set: arg.object }
    );
    //event.reply('added-prospect' + responseId, { ok: res.numAffected == 1 });
    if (Object.keys(arg.object).includes('state')) {
      getProspects(event, channel, { ...arg.object.state });
    }
  } catch (error) {
    // if an error happens
  }
});

ipcMain.on('delete-prospect', async (event, _id) => {
  try {
    console.log('delete-prospect', _id);

    const res = await db.linkBuildingTool.removeAsync({ _id: _id }, {});
    event.reply('added-prospect', { ok: res == 1 });
  } catch (error) {
    // if an error happens
  }
});

ipcMain.on('add-prospecta', async (event, arg, responseId) => {
  try {
    console.log('add-prospect', arg);
    delete arg.action;

    await db.linkBuildingTool.insertAsync(arg);
    event.reply('added-prospect' + responseId, { ok: true });
  } catch (error) {
    // if an error happens
  }
});

ipcMain.on('open-external', async (_, arg) => {
  console.log(`open-external`, arg);
  shell.openExternal(arg.url);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
