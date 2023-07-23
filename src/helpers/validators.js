/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
import { allPass, anyPass, compose, count, equals, propEq } from 'ramda'

const isColorRight = (baseColor, color) => baseColor === color
const isGreen = isColorRight.bind(null, 'green')
const isBlue = isColorRight.bind(null, 'blue')
const isRed = isColorRight.bind(null, 'red')
const isOrange = isColorRight.bind(null, 'orange')

const getRightAmount = (validator, {star, square, triangle, circle}) => count(validator, [star, square, triangle, circle])
const getGreenAmount = getRightAmount.bind(null, isGreen)
const getRedAmount = getRightAmount.bind(null, isRed)
const getBlueAmount = getRightAmount.bind(null, isBlue)
const getOrangeAmount = getRightAmount.bind(null, isOrange)

const isColorsSame = (firstEl, secondEl, fieldInfo) => fieldInfo[firstEl] === fieldInfo[secondEl]
const isTriangleEqualSquare = isColorsSame.bind(null, 'triangle', 'square')

const isColorAmountEqualValue = (val, validator, fieldInfo) => val === validator(fieldInfo)
const isGreenEqualTwo = isColorAmountEqualValue.bind(null, 2, getGreenAmount)

const getColorsAmount = (fieldInfo) => {
    let ans = {}
    Object.values(fieldInfo).forEach((val) => {
        if (val !== 'white') {
            val in ans ? ans[val]++ : ans[val] = 1
        }
    })
    return ans
}
const getFreqColor = (colors) => {
    let ans = 0
    const amount = Object.values(colors);
    amount.forEach((val) => {
        if (val > ans) ans = val
    })
    return ans
}

const getSameAmount = compose(getFreqColor, getColorsAmount)

const isCircleBlue = propEq('circle', 'blue');
const isStarRed = propEq('star', 'red');
const isStarWhite = propEq('star', 'white');
const isSquareOrange = propEq('square', 'orange');
const isTriangleGreen = propEq('triangle', 'green');

const isTriangleNotWhite = fieldInfo => fieldInfo['triangle'] !== 'white'

const isAmountNotLessValue = (validator, value, fieldInfo) => !(value > validator(fieldInfo))
const isRedNotLessOne = isAmountNotLessValue.bind(null, getRedAmount, 1)

export const validateFieldN1 = ({star, square, triangle, circle}) => {
    if (triangle !== 'white' || circle !== 'white') {
        return false;
    }

    return star === 'red' && square === 'green';
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (fieldInfo) => isAmountNotLessValue(fieldInfo, getGreenAmount, 2)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (fieldInfo) => equals(getRedAmount(fieldInfo), getBlueAmount(fieldInfo))

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (fieldInfo) => allPass([isCircleBlue, isStarRed, isSquareOrange])(fieldInfo);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (fieldInfo) => isAmountNotLessValue(fieldInfo, getSameAmount, 3)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (fieldInfo) => allPass([isGreenEqualTwo, isTriangleGreen, isRedNotLessOne])(fieldInfo);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (fieldInfo) => isColorAmountEqualValue(4, getOrangeAmount, fieldInfo);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (fieldInfo) => !anyPass([isStarWhite, isStarRed])(fieldInfo);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (fieldInfo) => isColorAmountEqualValue(4, getGreenAmount, fieldInfo);;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (fieldInfo) => allPass([isTriangleEqualSquare, isTriangleNotWhite])(fieldInfo);;
