type ModelProps ={
    selectedModel: string;
    setSelectedModel : (model: string) => void;
}

const ModelSelector = ({selectedModel, setSelectedModel}: ModelProps) => {
    const models = [
        { value : "gemini" , label: "Gemini" },
        { value : "qwen2.5" , label: "Qwen 2.5" }
    ];

    return (
        <div>
            <label htmlFor="model-select">
                AI Model :  
            </label>
            <select 
                id = "model-select"
                value = {selectedModel}
                onChange  = {(e)=> setSelectedModel(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', background: '#40444b', color: 'white', border: '1px solid #202225' }}
            >
                {models.map((model) => (
                    <option key={model.value} value={model.value}>
                        {model.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ModelSelector;
    