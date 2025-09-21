// 代码生成时间: 2025-09-21 17:55:37
 * Features:
 * - Validates URL format using a regular expression
 * - Checks if the URL is reachable using fetch (HTTP GET request)
 * - Provides user feedback on validity and reachability
 */
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'UrlValidator',
    props: {
        urlToValidate: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const isValid = ref(false);
        const isReachable = ref(false);
        const errorMessage = ref('');
        const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w \.-]*)*\/?$/;

        // Function to validate URL format
        function validateFormat(url) {
            return regex.test(url);
        }

        // Function to check URL reachability
        async function checkReachability(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                isReachable.value = response.ok;
            } catch (error) {
                isReachable.value = false;
                errorMessage.value = 'Failed to reach the URL.';
            }
        }

        // Function to validate the URL
        async function validateUrl() {
            if (!validateFormat(props.urlToValidate)) {
                isValid.value = false;
                errorMessage.value = 'Invalid URL format.';
                return;
            }
            isValid.value = true;
            await checkReachability(props.urlToValidate);
        }

        return {
            isValid,
            isReachable,
            errorMessage,
            validateUrl
        };
    }
});