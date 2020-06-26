export default {
    rollDie(dieSize) {
        return Math.floor(Math.random() * dieSize + 1)
    },

    d100() {
        return this.rollDie(100)
    },

    d10() {
        return this.rollDie(10)
    },

    /**
     * @param target: number
     * @param roll: number
     * @return {{crit: boolean, success: boolean, roll: number}}
     */
    simpleTest(target, roll = this.d100()) {
        return {
            roll: roll,
            success: ((roll <= target && roll <= 95) || roll <= 5),
            crit: (roll === 100 || (roll.toString()[1] === roll.toString()[0])),
        };
    },

    /**
     * @param target: number
     * @param modifier: number
     * @param roll: number
     * @return {{crit: boolean, success: boolean, roll: number}}
     */
    dramaticTest(target, modifier = 0, roll = this.d100()) {
        let result = this.simpleTest(target + modifier, roll);
        let successLevels = Math.floor((target + modifier)/10) - Math.floor(roll/10);
        if (target > 100 && result.success) {
            successLevels += Math.floor((target-100) / 10);
        }

        if (roll <= 5 && successLevels < 1) {
            successLevels = 1;
        }
        else if (roll >= 96 && successLevels > -1) {
            successLevels = -1;
        }

        result.successLevels = successLevels;
        return result
    },

    /**
     * @param targetA: object with 'target' and 'modifier' properties
     * @param targetB: object with 'target' and 'modifier' properties
     * @returns {{winner: string, results: [object, object], successLevel: number}}
     */
    opposedTest(targetA, targetB) {
        let winner = null, resultA, resultB;
        while (winner === null) {
            resultA = this.dramaticTest(targetA.target, targetA.modifier);
            resultB = this.dramaticTest(targetB.target, targetB.modifier);

            // If combatant A scored a better result, he wins
            if (resultA.successLevels > resultB.successLevels) {
                winner = 'A';
            }
            // If combatant B scored a better result, he wins
            else if (resultA.successLevels < resultB.successLevels) {
                winner = 'B';
            }
            // If it appears to be a tie, we check who wins
            else {
                // If the results are the same, we check if base score is the same
                if (targetA.target !== targetB.target) {
                    winner = targetA.target > targetB.target ? 'A' : 'B';
                }

                // If there is still no winner, we reroll
            }
        }

        return {
            winner: winner,
            successLevel: winner === 'A' ? resultA.successLevels - resultB.successLevels : resultB.successLevels - resultA.successLevels,
            results: [resultA, resultB]
        }
    }
};