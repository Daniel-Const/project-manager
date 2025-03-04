export default function Drawbar() {

    return (
        <div className="flex flex-row justify-center absolute top-2 inset-x-1/2 bg-gray-800 w-30">
            <button className="bg-white h-6 w-6" />
            <button className="bg-red-600 h-6 w-6" />
            <button className="bg-green-600 h-6 w-6" />
        </div>
    )
}