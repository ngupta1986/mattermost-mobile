// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {calculateDimensions} from 'app/utils/images';

const PORTRAIT_VIEWPORT = 315;
const IMAGE_MAX_HEIGHT = 350;
const IMAGE_MIN_DIMENSION = 50;

describe('Images calculateDimensions', () => {
    it('image smaller than 50x50 should return 50x50', () => {
        const {height, width} = calculateDimensions(20, 20, PORTRAIT_VIEWPORT);
        expect(height).toEqual(IMAGE_MIN_DIMENSION);
        expect(width).toEqual(IMAGE_MIN_DIMENSION);
    });

    it('images with height below 50 should return height of 50', () => {
        const {height} = calculateDimensions(45, 100, PORTRAIT_VIEWPORT);
        expect(height).toEqual(IMAGE_MIN_DIMENSION);
    });

    it('images with width below 50 should return width of 50', () => {
        const {width} = calculateDimensions(100, 45, PORTRAIT_VIEWPORT);
        expect(width).toEqual(IMAGE_MIN_DIMENSION);
    });

    it('images with that are 50x50 should return the same size', () => {
        const {height, width} = calculateDimensions(50, 50, PORTRAIT_VIEWPORT);
        expect(height).toEqual(IMAGE_MIN_DIMENSION);
        expect(width).toEqual(IMAGE_MIN_DIMENSION);
    });

    it('images with smaller sizes than the max allowed should return the same size', () => {
        const {height, width} = calculateDimensions(75, 150, PORTRAIT_VIEWPORT);
        expect(height).toEqual(75);
        expect(width).toEqual(150);
    });

    it('images with that have a width of the same size as the viewPort return the same size', () => {
        const {height, width} = calculateDimensions(75, PORTRAIT_VIEWPORT, PORTRAIT_VIEWPORT);
        expect(height).toEqual(75);
        expect(width).toEqual(PORTRAIT_VIEWPORT);
    });

    it('large images with more height than width should return a MAX height of 350', () => {
        const {height} = calculateDimensions(1920, 1080, PORTRAIT_VIEWPORT);
        expect(height).toEqual(IMAGE_MAX_HEIGHT);
    });

    it('large images with more width than height should return the MAX width equal to the viewPort', () => {
        const {width} = calculateDimensions(1080, 1920, PORTRAIT_VIEWPORT);
        expect(width).toEqual(PORTRAIT_VIEWPORT);
    });

    it('large images with the viewPort height defined should return the MAX height equal to the viewPort Height', () => {
        const {height} = calculateDimensions(1920, 1080, PORTRAIT_VIEWPORT, 340);
        expect(height).toEqual(340);
    });

    it('images with height below 50 but setting to 50 will make the width exceed the view port width should remain as is', () => {
        const {height, width} = calculateDimensions(45, 310, PORTRAIT_VIEWPORT);
        expect(height).toEqual(45);
        expect(width).toEqual(310);
    });
});
