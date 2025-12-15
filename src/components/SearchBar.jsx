import { Input } from "@/components/ui/input";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="max-w-md">
      <Input
        placeholder="Search posts by title or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
