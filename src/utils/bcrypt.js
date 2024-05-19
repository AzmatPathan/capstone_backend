import bcrypt from 'bcryptjs';

export const matchPassword = async function (password_hash, enteredPassword) {
    try {
        // Compare entered password with the hashed password
        const isMatch = await bcrypt.compare(enteredPassword, password_hash);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};


