import Loader from '../src/utils/loader';
import { EventsObject } from '../src/utils/EventsObject';

describe('Loader', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should initialize with correct properties', () => {
      expect(Loader.totalCnt).toBe(0);
      expect(Loader.loadedCnt).toBe(0);
    });

    it('should load images and trigger progress events', () => {
      const mockFireEvent = jest.spyOn(EventsObject.prototype, 'fireEvent');

      Loader.load();

      expect(Loader.totalCnt).toBe(Loader.imgs.length);
      expect(Loader.loadedCnt).toBe(0);

      // Simulate image load events
      for (let i = 0; i < Loader.imgs.length; i++) {
        Loader.onProgress();
      }

      expect(mockFireEvent).toHaveBeenCalledWith('progress', expect.any(Number));
      expect(mockFireEvent).toHaveBeenCalledWith('completed');
      expect(Loader.loadedCnt).toBe(Loader.totalCnt);
    });

    it('should handle image loading errors gracefully', () => {
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
      
      // Simulate a load error
      jest.spyOn(global, 'Image').mockImplementation(() => {
        const img: any = {
          set src(_url: string) {
            throw new Error('Image load error');
          }
        };
        return img;
      });

      Loader.preloadImage('invalid/url');

      expect(mockConsoleError).toHaveBeenCalledWith('Failed Loading Images');
      expect(mockConsoleError).toHaveBeenCalledWith(expect.any(Error));
    });
});
