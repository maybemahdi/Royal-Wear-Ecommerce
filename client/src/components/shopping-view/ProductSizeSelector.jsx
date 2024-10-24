
const ProductSizeSelector = ({selectedSize, handleSizeChange}) => {

  return (
    <div className="py-4">
      <div className="flex justify-between items-center">
        <span className="font-bold">Select Size</span>
        <span className="font-bold">
          {selectedSize ? `Size: ${selectedSize}` : "No size selected"}
        </span>
      </div>

      {/* Dropdown for selecting sizes */}
      <select
        value={selectedSize}
        onChange={handleSizeChange}
        className="mt-2 p-2 border rounded"
      >
        <option value="" disabled>
          Select a size
        </option>
        <option value="M">Medium (M)</option>
        <option value="L">Large (L)</option>
        <option value="XL">Extra Large (XL)</option>
        <option value="XXL">Double Extra Large (2XL)</option>
      </select>
    </div>
  );
};

export default ProductSizeSelector;
