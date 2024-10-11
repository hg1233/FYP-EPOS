import { expect } from '@wdio/globals';
import { app } from 'electron';
import { browser } from 'wdio-electron-service';

describe('window manager tests', () => {
    it('should open fullscreen window', async () => {
        var isFullScreen = await browser.electron.execute(
            (electron) => { 
              return electron.BrowserWindow.getFocusedWindow().isFullScreen();
            },
          );
        expect(isFullScreen).toEqual(true);
    })
});