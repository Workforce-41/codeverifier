document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = document.getElementById('task').value;
    const description = document.getElementById('description').value;
    const codeFile = document.getElementById('codeFile').files[0];

    // Show the spinner
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('output').style.display = 'none'; // Hide output while loading

    if (codeFile) {
        const reader = new FileReader();

        reader.onload = async (event) => {
            const fileContent = event.target.result;

            try {
                const response = await fetch('http://localhost:3000/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task, description, code: fileContent })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const result = await response.text();
                displayOutput(result);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
                displayOutput('Error: ' + error.message);
            }
        };

        reader.readAsText(codeFile);
    } else {
        // Hide the spinner if no file is selected
        document.getElementById('spinner').classList.add('hidden');
    }
});

function displayOutput(result) {
    const outputDiv = document.getElementById('output');
    
    // Replace newline characters with <br> tags
    let formattedResult = result.replace(/\n/g, '<br>');
    
    // Replace **text** with <strong>text</strong>
    formattedResult = formattedResult.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace ## with <h2> tags
    formattedResult = formattedResult.replace(/##(.*?)<br>/g, '<h2>$1</h2><br>');

    // Replace *text* with <li> tags
    formattedResult = formattedResult.replace(/\*(.*?)\*/g, '<li>$1</li>');

    // Replace new lines between bullet points with <br> tags
    formattedResult = formattedResult.replace(/<li>[\s\S]*?<br>/g, (match) => match.replace(/<br>/g, '</li><li>') + '</li>');

    outputDiv.style.display = 'block';
    outputDiv.innerHTML = formattedResult; 
    console.log(formattedResult);

    // Hide the spinner after displaying the output
    document.getElementById('spinner').classList.add('hidden');
}
