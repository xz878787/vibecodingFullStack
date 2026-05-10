import cv2
import numpy as np

img = np.zeros((100, 100, 3), dtype=np.uint8)
img[:] = (0, 255, 0)
cv2.imwrite('test.png', img)
print('Test image created')
