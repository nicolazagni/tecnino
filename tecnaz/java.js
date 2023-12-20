document.addEventListener('DOMContentLoaded', function () {
    const componentList = document.getElementById('component-list');
    const canvas = document.getElementById('canvas');
    const generateButton = document.getElementById('generate-button');
    const materialsList = document.getElementById('materials-list');
    let components = [];
    let connections = [];

    // Sample components (you should load these dynamically from a database)
    const sampleComponents = ['Resistor', 'LED', 'Capacitor'];

    // Generate the component list
    sampleComponents.forEach(component => {
        const componentDiv = document.createElement('div');
        componentDiv.className = 'component';
        componentDiv.draggable = true;
        componentDiv.textContent = component;
        components.push(componentDiv);
        componentList.appendChild(componentDiv);
    });

    // Add drag and drop functionality
    components.forEach(component => {
        component.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', component.textContent);
        });
    });

    canvas.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    canvas.addEventListener('drop', function (e) {
        e.preventDefault();
        const componentName = e.dataTransfer.getData('text/plain');
        const component = document.createElement('div');
        component.className = 'component';
        component.textContent = componentName;
        component.style.position = 'absolute';
        component.style.left = `${e.clientX - canvas.getBoundingClientRect().left}px`;
        component.style.top = `${e.clientY - canvas.getBoundingClientRect().top}px`;
        canvas.appendChild(component);
    });

    generateButton.addEventListener('click', function () {
        connections = [];
        const lines = document.querySelectorAll('.connection-line');
        lines.forEach(line => line.remove());

        const componentsOnCanvas = document.querySelectorAll('#canvas .component');
        componentsOnCanvas.forEach(startComponent => {
            componentsOnCanvas.forEach(endComponent => {
                if (startComponent !== endComponent) {
                    const line = document.createElement('div');
                    line.className = 'connection-line';
                    canvas.appendChild(line);

                    const rect1 = startComponent.getBoundingClientRect();
                    const rect2 = endComponent.getBoundingClientRect();

                    const x1 = rect1.left - canvas.getBoundingClientRect().left + rect1.width / 2;
                    const y1 = rect1.top - canvas.getBoundingClientRect().top + rect1.height / 2;
                    const x2 = rect2.left - canvas.getBoundingClientRect().left + rect2.width / 2;
                    const y2 = rect2.top - canvas.getBoundingClientRect().top + rect2.height / 2;

                    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const angle = Math.atan2(y2 - y1, x2 - x1);

                    line.style.width = `${length}px`;
                    line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}rad)`;
                    connections.push({ start: startComponent.textContent, end: endComponent.textContent });
                }
            });
        });

        // Generate materials list
        materialsList.innerHTML = '<h2>Materials List</h2>';
        connections.forEach(connection => {
            materialsList.innerHTML += `<p>${connection.start} connected to ${connection.end}</p>`;
        });
    });
});
